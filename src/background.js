import { getCurrentPdfTabs } from './utility/utilities'

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
    const queue = [...(storage.queue ?? []), ...request.tabs]
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
chrome.runtime.onMessage.addListener(addItemsToQueue)
chrome.storage.onChanged.addListener(queueListener)

const setBadgeText = async () => {
  const tabPdfs = await getCurrentPdfTabs()
  const linkPdfs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  let text = ''
  if (defaultAction === 'TABS' && (tabPdfs ?? []).length > 0) {
    text = (tabPdfs ?? []).length.toString()
  }
  if (defaultAction === 'LINKS' && (linkPdfs ?? []).length > 0) {
    text = (linkPdfs ?? []).length.toString()
  }
  await chrome.action.setBadgeText({ text })
  return true
}

chrome.tabs.onUpdated.addListener(setBadgeText)
chrome.tabs.onCreated.addListener(setBadgeText)
chrome.tabs.onRemoved.addListener(setBadgeText)
chrome.runtime.onStartup.addListener(setBadgeText)
chrome.runtime.onInstalled.addListener(setBadgeText)
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'local' && 'defaultAction' in changes) {
    await setBadgeText()
  }
})
