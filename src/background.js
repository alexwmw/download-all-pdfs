const download = async (item, setFinished) => {
  const { doClose, history } = await chrome.storage.local.get([
    'doClose',
    'history',
  ])
  chrome.downloads.download({ url: item.url }, () => {
    if ((doClose ?? true) && item.hasOwnProperty('id')) {
      chrome.tabs.remove(item.id)
    }
    const h = [item, ...(history ?? []).slice(0, 99)]
    console.log({ history: h })
    chrome.storage.local.set({ history: h })

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
    }).then(() => {
      chrome.storage.local.set({ queue })
    })
    return true
  }
})
chrome.storage.onChanged.addListener((changes, area) => {
  if (
    area === 'session' &&
    changes.queue?.newValue &&
    changes.queue?.newValue.length === 0
  ) {
    console.log('Queue empty')
    chrome.notifications.create(
      'queueEmpty',
      {
        type: 'basic',
        iconUrl: './48.png',
        title: 'YOUR_EXTENSION_NAME',
        message: 'SOME_MESSAGE',
        buttons: [
          {
            title: 'Ok',
          },
          {
            title: 'Cancel',
          },
        ],
      },
      () => {
        console.log('Notified', chrome.runtime.lastError)
        //
      }
    )
  }
})
