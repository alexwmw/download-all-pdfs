import {
  getActiveTab,
  getCurrentActiveTabPdfLinks,
  isPdfUrl,
} from './utility/utilities'

const pdfTabIds = []

function getHeaderFromHeaders(headers, headerName) {
  for (let i = 0; i < headers.length; ++i) {
    const header = headers[i]
    if (header.name.toLowerCase() === headerName) {
      return header
    }
  }
}

const getCurrentPdfTabs = async () => {
  const queryOptions = {
    url: ['http://*/*', 'https://*/*'],
  }
  const tabs = await chrome.tabs.query(queryOptions)
  return tabs.filter((tab) => pdfTabIds.includes(tab.id) || isPdfUrl(tab.url))
}

const removeFromPdfTabIds = (tabId) => {
  const index = pdfTabIds.indexOf(tabId)
  if (index >= 0) pdfTabIds.splice(index, 1)
}

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.tabId !== -1) {
      removeFromPdfTabIds(details.tabId)
      const header = getHeaderFromHeaders(
        details.responseHeaders,
        'content-type'
      )
      if (header && header.value.split(';', 1)[0].endsWith('/pdf')) {
        pdfTabIds.push(details.tabId)
      }
      console.log('Handle web request headers', {
        tabId: details.tabId,
        tabToMimeType: header?.value?.split(';', 1)[0] ?? false,
      })
    }
  },
  {
    urls: ['*://*/*'],
    types: ['main_frame'],
  },
  ['responseHeaders']
)

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
  const { doClose, history, errors } = await chrome.storage.local.get([
    'doClose',
    'history',
    'errors',
  ])
  chrome.downloads.download({ url: item.url }, (downloadId) => {
    if (downloadId === undefined) {
      console.error('Error downloading:', item.url)
      chrome.storage.local.set({ errors: [item, ...(errors ?? [])] })
      setFinished()
      return
    }
    if ((doClose ?? true) && item.hasOwnProperty('id')) {
      setTimeout(() => chrome.tabs.remove(item.id), 1000)
    }
    const h = [item, ...(history ?? []).slice(0, 99)]
    chrome.storage.local.set({ history: h })

    setFinished()
  })
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
  if (
    defaultAction !== 'CHOOSE' &&
    (tabPdfs ?? []).length === 0 &&
    (linkPdfs ?? []).length === 0
  ) {
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

  const hasItems = {
    TABS: tabPdfs.length > 0,
    LINKS: linkPdfs.length > 0,
  }

  let popup = './popup.html'
  if (hasItems[defaultAction]) {
    popup = ''
  }
  console.log('Set popup', {
    popupSet: Boolean(popup),
    defaultAction,
    hasItems: hasItems[defaultAction],
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
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (info.status === 'complete') await setBadgeText(tabId)
})

chrome.tabs.onActivated.addListener((activeInfo) =>
  setBadgeText(activeInfo.tabId)
)
chrome.tabs.onCreated.addListener((tab) => {
  setBadgeText(tab.id)
})
chrome.tabs.onRemoved.addListener((tabId) => {
  setBadgeText(tabId)
  removeFromPdfTabIds(tabId)
})
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== 'local' || !('defaultAction' in changes)) return
  const { id } = await getActiveTab()
  if (id) setBadgeText(id)
  setPopup(changes.defaultAction.newValue)
})

// Install and startup
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
