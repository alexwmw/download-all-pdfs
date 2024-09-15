// content.js
import { isPdfUrl } from './utility/utilities'

const getPdfLinks = async () => {
  const pdfLinks = []
  const anchors = document.querySelectorAll('a[href]')
  for (const anchor of anchors) {
    const href = anchor.href
    if (!href) continue

    const isPdf = await isPdfUrl(href)
    if (!isPdf) continue

    if (pdfLinks.some((item) => item.url === href)) continue

    // const pdfTitle = await getPdfTitle(href)
    let title = anchor.getAttribute('title') || href.split('/').pop()
    if (title.includes('.pdf')) {
      title = title.split('.pdf')[0]
    }
    const thisItem = {
      url: href,
      title: title,
    }

    pdfLinks.push(thisItem)
  }
  console.log('Get pdf links', { anchors, pdfLinks })
  return pdfLinks
}

// Listen for a message from the background script to trigger the function
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPdfLinks') {
    getPdfLinks().then((links) => {
      sendResponse({ links })
    })
  }
  return true
})
