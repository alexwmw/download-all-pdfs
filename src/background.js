import { generateHexId, getActiveTab, isPdfUrl } from './utility/utilities'

const PDF_TAB_IDS = []

const DEBUG_MODE = false

const log = (...args) => {
  if (DEBUG_MODE) console.log(...args)
}

const getCurrentPdfTabs = async () => {
  const queryOptions = {
    url: ['http://*/*', 'https://*/*'],
  }
  const pdfTabs = []
  const tabs = await chrome.tabs.query(queryOptions)
  log('Get current pdf tabs', {
    pdfTabsById: tabs.filter((tab) => PDF_TAB_IDS.includes(tab.id)),
    pdfTabsByUrl: tabs.filter((tab) => isPdfUrl(tab.url)),
  })
  for (const tab of tabs) {
    if (isPdfUrl(tab.url) || PDF_TAB_IDS.includes(tab.id)) {
      pdfTabs.push(tab)
    }
  }
  return pdfTabs
}

const removeFromPdfTabIds = (tabId) => {
  const index = PDF_TAB_IDS.indexOf(tabId)
  if (index >= 0) PDF_TAB_IDS.splice(index, 1)
}

const headersListener = async (details) => {
  const contentTypeHeader = details.responseHeaders.find(
    (header) => header.name.toLowerCase() === 'content-type'
  )
  const mimeType = contentTypeHeader ? contentTypeHeader.value : ''
  if (mimeType.startsWith('application/pdf')) {
    log('headersListener -- PDF detected', { tabId })
    if (!PDF_TAB_IDS.includes(details.tabId)) {
      PDF_TAB_IDS.push(details.tabId)
    }
  }
}

chrome.webRequest.onHeadersReceived.addListener(
  headersListener,
  {
    urls: ['http://*/*', 'https://*/*'],
    types: ['main_frame', 'sub_frame', 'object', 'xmlhttprequest'],
  },
  ['responseHeaders']
)

chrome.tabs.onRemoved.addListener((tabId) => {
  removeFromPdfTabIds(tabId)
})

const handleGetIsPdfTab = (request, sender, sendResponse) => {
  if (request.action === 'getIsPdfTab') {
    log('Handle get is pdf tab', {
      ...request,
      isTabPdf: PDF_TAB_IDS.includes(request.tabId),
    })
    sendResponse(PDF_TAB_IDS.includes(request.tabId))
  }
  sendResponse(false)
  return true
}
chrome.runtime.onMessage.addListener(handleGetIsPdfTab)

const addItemsToQueue = async (request, sender, sendResponse) => {
  if (request.action === 'download') {
    const itemsWithIds = request.items.map((item) => {
      return {
        ...item,
        queueId: generateHexId(),
      }
    })

    const storage = await chrome.storage.session.get()
    const queue = [...(storage.queue ?? []), ...itemsWithIds]
    chrome.storage.session.set({ queue })
    return true
  }
}

let CURRENT_DOWNLOAD = ''

async function finishDownload(item, listener) {
  CURRENT_DOWNLOAD = ''
  const { queue } = await chrome.storage.session.get(['queue'])
  chrome.storage.session.set({ queue: queue?.slice(1) ?? [] }).then(() => {
    log(
      'queueListener -- finished',
      { CURRENT_DOWNLOAD, next: queue[1]?.url },
      item
    )
  })

  if (listener) {
    chrome.downloads.onChanged.removeListener(listener)
  }
  if (item) {
    const { doClose } = await chrome.storage.local.get(['doClose'])
    if ((doClose ?? false) && item.hasOwnProperty('id')) {
      log('queueListener -- closing tab', { tabId: item.id }, item)
      chrome.tabs.remove(item.id)
    }
  }
}

const queueListener = async (changes, area) => {
  if (area !== 'session') return
  const queue = changes.queue?.newValue ?? []
  if (queue?.length === 0) return

  const item = queue[0]

  if (CURRENT_DOWNLOAD === item.queueId) {
    return
  }
  CURRENT_DOWNLOAD = item.queueId
  log('queueListener -- initiate', { CURRENT_DOWNLOAD }, item)

  const downloadId = await chrome.downloads.download({
    url: item.url,
  })

  if (downloadId === undefined) {
    chrome.runtime.sendMessage({
      action: 'addError',
      error: 'DID_NOT_CONNECT',
      item,
    })
    log(
      'queueListener -- error',
      { CURRENT_DOWNLOAD, downloadId, error: 'DID_NOT_CONNECT' },
      item
    )
    finishDownload()
    return true
  }
  const { wait } = await chrome.storage.local.get(['wait'])
  if (wait !== true) {
    log('queueListener -- did not wait', {
      CURRENT_DOWNLOAD,
    })
    finishDownload(item)
  } else {
    log('queueListener -- waiting for download', {
      CURRENT_DOWNLOAD,
    })
  }

  function listener(downloadDelta) {
    if (downloadDelta.id !== downloadId) return
    if (downloadDelta.state !== 'in_progress') {
      if (downloadDelta.error) {
        chrome.runtime.sendMessage({
          action: 'addError',
          error: downloadDelta.error.current ?? 'UNKNOWN',
          item,
        })
        log(
          'queueListener -- error',
          {
            CURRENT_DOWNLOAD,
            downloadId,
            error: downloadDelta.error.current ?? 'UNKNOWN',
          },
          item
        )
        if (wait) finishDownload(undefined, listener)
      } else {
        if (wait) finishDownload(item, listener)
      }
    }
    return true
  }

  chrome.downloads.onChanged.addListener(listener)
  return true
}

const setBadgeText = async (tabId) => {
  const tabPdfs = await getCurrentPdfTabs()
  let text = ''
  let icon = {
    16: '16.png',
    48: '48.png',
    128: '128.png',
  }
  if (tabPdfs.length > 0) {
    text = (tabPdfs ?? []).length.toString()
  }
  if ((tabPdfs ?? []).length === 0) {
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

  const hasItems =
    {
      TABS: tabPdfs.length > 0,
    }[defaultAction] ?? false

  let popup = './popup.html'
  if (hasItems) {
    popup = ''
  }
  log('Set popup', {
    popupSet: Boolean(popup),
    defaultAction,
    hasItems: hasItems,
  })
  chrome.action.setPopup({ popup })
}

const handleActionClick = async (tab) => {
  const tabPdfs = await getCurrentPdfTabs()

  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  const storage = await chrome.storage.session.get(['queue'])
  let queue

  if (defaultAction === 'TABS' && tabPdfs.length) {
    queue = [...(storage.queue ?? []), ...tabPdfs]
    chrome.storage.session.set({ queue }).then(() => {
      chrome.action.setBadgeBackgroundColor({ color: 'seagreen' })
    })
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
