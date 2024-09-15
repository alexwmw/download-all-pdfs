export const isPdfUrl = (url) => {
  const resource = url.split('/').pop().toLowerCase()
  return resource.endsWith('.pdf') || resource.includes('.pdf?')
}

export async function getCurrentPdfTabs() {
  const queryOptions = {
    url: ['http://*/*', 'https://*/*'],
  }
  const httpTabs = (await chrome.tabs.query(queryOptions)) ?? []
  const pdfTabs = []
  for (const tab of httpTabs) {
    const isPdfByType = await chrome.runtime.sendMessage({
      action: 'getIsPdfTab',
      tabId: tab.id,
    })
    const isPdfByUrl = isPdfUrl(tab.url)
    if (isPdfByType || isPdfByUrl) pdfTabs.push(tab)
    console.log('Get current pdf tabs', {
      tab,
      isPdfByType,
      isPdfByUrl,
    })
  }
  return pdfTabs
}

export async function getCurrentActiveTabPdfLinks(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      action: 'getPdfLinks',
    })
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
