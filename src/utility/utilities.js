export async function getCurrentPdfTabs() {
  const queryOptions = {
    url: ['http://*/*.pdf', 'https://*/*.pdf'],
  }
  return (await chrome.tabs.query(queryOptions)) ?? []
}

export async function getCurrentActiveTabPdfLinks(tabId) {
  console.log(`Getting current active tab pdf links for ${tabId}`)
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      action: 'getPdfLinks',
    })
    console.log('response: ', response?.links)
    return response?.links ?? []
  } catch (e) {
    return []
  }
}

export async function getActiveTab() {
  const queryOptions = {
    active: true,
    currentWindow: true,
  }
  const tabs = await chrome.tabs.query(queryOptions)
  return tabs[0]
}

export async function initDownload(items) {
  return await chrome.runtime.sendMessage({
    action: 'download',
    items,
  })
}
