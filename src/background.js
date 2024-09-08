const download = async (item, setFinished) => {
  const { doClose } = await chrome.storage.local.get(['doClose'])
  chrome.downloads.download({ url: item.url }, () => {
    if (doClose && item.hasOwnProperty('id')) {
      chrome.tabs.remove(item.id)
    }
    setFinished()
  })
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'download') {
    const storage = await chrome.storage.session.get()
    const queue = [...(storage.queue ?? []), ...request.tabs]
    chrome.storage.session.set({ queue })
    return true
  }
})

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'session' && (changes.queue?.newValue ?? []).length > 0) {
    const queue = [...(changes.queue?.newValue ?? [])]
    const item = queue.shift()
    download(item, () => {
      chrome.storage.session.set({ queue })
    })
    return true
  }
})
