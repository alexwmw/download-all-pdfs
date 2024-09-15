// content.js
const getPdfLinks = () => {
  const pdfLinks = []
  const anchors = document.querySelectorAll('a[href$=".pdf"]')

  anchors.forEach((anchor) => {
    const href = anchor.href
    if (href) {
      // Get the title from anchor text, title attribute, or fallback to URL
      const title =
        anchor.textContent.trim() ||
        anchor.getAttribute('title') ||
        href.split('/').pop()

      pdfLinks.push({
        url: href,
        title: title,
      })
    }
  })
  return pdfLinks
}

// Listen for a message from the background script to trigger the function
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPdfLinks') {
    sendResponse({ links: getPdfLinks() })
  }
  return true
})
