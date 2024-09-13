import { getCurrentPdfTabs, initDownload } from './utility/utilities'

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
const setPopup = async () => {
  const tabPdfs = await getCurrentPdfTabs()
  const linkPdfs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  let popup = './popup.html'
  if (defaultAction === 'TABS') {
    popup = ''
  }
  if (defaultAction === 'LINKS') {
    popup = ''
  }
  await chrome.action.setPopup({ popup })
  return true
}

const handleActionClick = async (tab) => {
  const tabPdfs = await getCurrentPdfTabs()
  const linkPdfs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const { defaultAction } = await chrome.storage.local.get(['defaultAction'])
  if (defaultAction === 'TABS') {
    await initDownload(tabPdfs)
  }
  if (defaultAction === 'LINKS') {
    // await initDownload(linkPdfs)
  }
  return true
}

chrome.runtime.onMessage.addListener(addItemsToQueue)
chrome.tabs.onUpdated.addListener(setBadgeText)
chrome.tabs.onCreated.addListener(setBadgeText)
chrome.tabs.onRemoved.addListener(setBadgeText)
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
