export async function getCurrentPdfTabs() {
  const queryOptions = {
    url: ['http://*/*.pdf', 'https://*/*.pdf'],
  }
  return await chrome.tabs.query(queryOptions)
}

export async function initDownload(items) {
  return await chrome.runtime.sendMessage({
    action: 'download',
    items,
  })
}
