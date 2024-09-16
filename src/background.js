import {
  getActiveTab,
  getCurrentActiveTabPdfLinks,
  isPdfUrl,
} from './utility/utilities'

const pdfTabIds = []

const getCurrentPdfTabs = async () => {
  const queryOptions = {
    url: ['http://*/*', 'https://*/*'],
  }
  const pdfTabs = []
  const tabs = await chrome.tabs.query(queryOptions)
  console.log('Get current pdf tabs', {
    pdfTabsById: tabs.filter((tab) => pdfTabIds.includes(tab.id)),
    pdfTabsByUrl: tabs.filter((tab) => isPdfUrl(tab.url)),
  })
  for (const tab of tabs) {
    if (isPdfUrl(tab.url) || pdfTabIds.includes(tab.id)) {
      pdfTabs.push(tab)
    }
  }
  return pdfTabs
}

const removeFromPdfTabIds = (tabId) => {
  const index = pdfTabIds.indexOf(tabId)
  if (index >= 0) pdfTabIds.splice(index, 1)
}

// Function to check MIME type in the tab
const updatePdfListByMimeType = (tabId) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      func: () => document.contentType, // Get the MIME type from the contentType property
    },
    (results) => {
      if (chrome.runtime.lastError) {
        console.log(
          'Update pdf list by mime type',
          { tabId },
          'Script execution failed: ',
          chrome.runtime.lastError
        )
        return
      }
      const mimeType = results?.[0]?.result
      if (!mimeType) return
      console.log('Update pdf list by mime type', { tabId, mimeType })
      removeFromPdfTabIds(tabId)
      if (mimeType === 'application/pdf') {
        pdfTabIds.push(tabId)
      }
    }
  )
}

// Run the script when a new tab is created
chrome.tabs.onCreated.addListener((tab) => {
  updatePdfListByMimeType(tab.id)
})

// Run the script when a tab is updated (like URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Wait until the page fully loads
    if (tab.url.startsWith('http')) updatePdfListByMimeType(tabId)
  }
})
chrome.tabs.onRemoved.addListener((tabId) => {
  removeFromPdfTabIds(tabId)
})
chrome.runtime.onInstalled.addListener(async (details) => {
  const queryOptions = {
    url: ['http://*/*', 'https://*/*'],
  }
  const tabs = await chrome.tabs.query(queryOptions)
  for (const tab of tabs) {
    const tabId = tab.id
    if (tab.url.startsWith('http')) updatePdfListByMimeType(tabId)
  }
})

const handleGetIsPdfTab = (request, sender, sendResponse) => {
  console.log('Handle get is pdf tab', {
    ...request,
    isTabPdf: pdfTabIds.includes(request.tabId),
  })
  if (request.action === 'getIsPdfTab') {
    sendResponse(pdfTabIds.includes(request.tabId))
  }
  sendResponse(false)
  return true
}
chrome.runtime.onMessage.addListener(handleGetIsPdfTab)

const download = async (item, setFinished) => {
  const { doClose, errors } = await chrome.storage.local.get([
    'doClose',
    'errors',
  ])
  chrome.downloads.download(
    {
      url: item.url,
    },
    (downloadId) => {
      if (downloadId === undefined) {
        console.error('Error downloading:', item.url)
        chrome.storage.local.set({ errors: [item, ...(errors ?? [])] })
        setFinished()
        return
      }
      if ((doClose ?? false) && item.hasOwnProperty('id')) {
        setTimeout(() => chrome.tabs.remove(item.id), 1000)
      }

      setFinished()
    }
  )
}

const addItemsToQueue = async (request, sender, sendResponse) => {
  if (request.action === 'download') {
    const storage = await chrome.storage.session.get()
    const queue = [...(storage.queue ?? []), ...request.items]
    chrome.storage.session.set({ queue })
    return true
  }
}

const queueListener = (changes, area) => {
  if (area !== 'session') return
  const queueValue = changes.queue?.newValue ?? []
  if (queueValue.length > 0) {
    const queue = [...queueValue]
    const item = queue.shift()
    download(item, () => {
      chrome.storage.session.set({ queue })
    })
  }
  return true
}

const setBadgeText = async (tabId) => {
  const tabPdfs = await getCurrentPdfTabs()
  const linkPdfs = await getCurrentActiveTabPdfLinks(tabId)
  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  let text = ''
  let icon = {
    16: '16.png',
    48: '48.png',
    128: '128.png',
  }
  if (defaultAction === 'TABS' && tabPdfs.length > 0) {
    text = (tabPdfs ?? []).length.toString()
  }
  if (defaultAction === 'LINKS' && linkPdfs.length > 0) {
    text = (linkPdfs ?? []).length.toString()
  }
  if ((tabPdfs ?? []).length === 0 && (linkPdfs ?? []).length === 0) {
    icon = {
      16: '16_faded.png',
      48: '48_faded.png',
      128: '128_faded.png',
    }
  }
  await chrome.action.setIcon({ path: icon })
  await chrome.action.setBadgeText({ text })
  await chrome.action.setBadgeTextColor({ color: '#ffffff' })
  await chrome.action.setBadgeBackgroundColor({ color: '#393fd3' })
  return true
}

const setPopup = async (defaultAction) => {
  const tabPdfs = await getCurrentPdfTabs()
  const activeTab = await getActiveTab()
  const linkPdfs = await getCurrentActiveTabPdfLinks(activeTab.id)

  const hasItems =
    {
      TABS: tabPdfs.length > 0,
      LINKS: linkPdfs.length > 0,
    }[defaultAction] ?? false

  let popup = './popup.html'
  if (hasItems) {
    popup = ''
  }
  console.log('Set popup', {
    popupSet: Boolean(popup),
    defaultAction,
    hasItems: hasItems,
  })
  chrome.action.setPopup({ popup })
}

const handleActionClick = async (tab) => {
  const tabPdfs = await getCurrentPdfTabs()
  const linkPdfs = await getCurrentActiveTabPdfLinks(tab.id)

  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  const storage = await chrome.storage.session.get(['queue'])
  let queue

  if (defaultAction === 'TABS' && tabPdfs.length) {
    queue = [...(storage.queue ?? []), ...tabPdfs]
    await chrome.storage.session.set({ queue })
  }
  if (defaultAction === 'LINKS' && linkPdfs.length) {
    queue = [...(storage.queue ?? []), ...linkPdfs]
    await chrome.storage.session.set({ queue })
  }
  return true
}

chrome.runtime.onMessage.addListener(addItemsToQueue)
chrome.storage.onChanged.addListener(queueListener)
chrome.action.onClicked.addListener(handleActionClick)

// Change badge and popup
chrome.tabs.onUpdated.addListener(async (tabId, info) => {
  if (info.status === 'complete') await setBadgeText(tabId)
  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  setPopup(defaultAction)
})
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  setBadgeText(activeInfo.tabId)
  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  setPopup(defaultAction)
})
chrome.tabs.onCreated.addListener(async (tab) => {
  setBadgeText(tab.id)
  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  setPopup(defaultAction)
})
chrome.tabs.onRemoved.addListener(async (tabId) => {
  setBadgeText(tabId)
  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  setPopup(defaultAction)
})
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== 'local' || !('defaultAction' in changes)) return
  const { id } = await getActiveTab()
  if (id) setBadgeText(id)
  setPopup(changes.defaultAction.newValue)
})
chrome.runtime.onStartup.addListener(async () => {
  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  const { id } = await getActiveTab()
  if (id) setBadgeText(id)
  setPopup(defaultAction)
})
chrome.runtime.onInstalled.addListener(async () => {
  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  const { id } = await getActiveTab()
  if (id) setBadgeText(id)
  setPopup(defaultAction)
})
