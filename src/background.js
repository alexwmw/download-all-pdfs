import {
  getActiveTab,
  getCurrentActiveTabPdfLinks,
  getCurrentPdfTabs,
} from './utility/utilities'

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
  let linkPdfs = []
  if (tabId) {
    linkPdfs = await getCurrentActiveTabPdfLinks(tabId)
  }

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
const setPopup = async () => {
  const tabPdfs = await getCurrentPdfTabs()
  const activeTab = await getActiveTab()
  const linkPdfs = await getCurrentActiveTabPdfLinks(activeTab.id)
  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  let popup = './popup.html'
  if (defaultAction === 'TABS' && tabPdfs.length > 0) {
    popup = ''
  }
  if (defaultAction === 'LINKS' && linkPdfs.length > 0) {
    popup = ''
  }
  await chrome.action.setPopup({ popup })
  return true
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
  } else if (defaultAction === 'LINKS' && linkPdfs.length) {
    queue = [...(storage.queue ?? []), ...linkPdfs]
    await chrome.storage.session.set({ queue })
  } else {
  }
  return true
}

chrome.runtime.onMessage.addListener(addItemsToQueue)
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === 'complete') setBadgeText(tabId)
})
chrome.tabs.onActivated.addListener((activeInfo) =>
  setBadgeText(activeInfo.tabId)
)
chrome.tabs.onCreated.addListener((tab) => setBadgeText(tab.id))
chrome.tabs.onRemoved.addListener((tabId) => {
  setBadgeText(tabId)
})
chrome.runtime.onStartup.addListener(async () => {
  await setBadgeText()
  await setPopup()
  return true
})
chrome.runtime.onInstalled.addListener(async () => {
  await setBadgeText()
  await setPopup()
  return true
})
chrome.storage.onChanged.addListener(queueListener)
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'local' && 'defaultAction' in changes) {
    await setBadgeText()
    await setPopup()
  }
  return true
})
chrome.action.onClicked.addListener(handleActionClick)
