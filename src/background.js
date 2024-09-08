const download = (url, setFinished) => {
  chrome.downloads.download({ url: url }, setFinished)
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'download') {
    const storage = await chrome.storage.session.get()
    const queue = [...(storage.queue ?? []), ...request.urls]
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
  }
})
