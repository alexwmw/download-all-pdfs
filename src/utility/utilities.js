const checkPdfContentType = async (url) => {
  return false
  // todo: implement
  // try {
  //   // Make a request to check headers
  //   const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' })
  //   const contentType = response.headers.get('content-type')
  //
  //   // If the content-type is 'application/pdf', it's a PDF
  //   if (contentType?.toLowerCase().includes('application/pdf')) {
  //     return true
  //   }
  //
  //   return false
  // } catch (error) {
  //   console.error('Failed to fetch content type:', error)
  //   return false
  // }
}

export const isPdfUrl = async (url) => {
  const resource = url.split('/').pop().toLowerCase()
  const isPdfResource = resource.endsWith('.pdf') || resource.includes('.pdf?')
  if (isPdfResource) {
    return true
  }
  // If it's not immediately clear, we can try to fetch headers and check content-type
  try {
    const isPdfContent = await checkPdfContentType(url)
    return isPdfContent
  } catch (error) {
    console.error('Error checking content type:', error)
    return false
  }
}

export async function getCurrentPdfTabs() {
  const queryOptions = {
    url: ['http://*/*', 'https://*/*'],
  }
  const httpTabs = (await chrome.tabs.query(queryOptions)) ?? []
  const pdfTabs = []
  for (const tab of httpTabs) {
    const isPdf = await isPdfUrl(tab.url)
    if (isPdf) pdfTabs.push(tab)
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
