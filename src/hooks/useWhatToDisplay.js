import { useEffect, useState } from 'react'

const useWhatToDisplay = ({ queue, tabPdfs, pagePdfs, showSettings, complete }) => {
  const [defaultAction, setDefaultAction] = useState()
  useEffect(() => {
    chrome.storage.local.get(['defaultAction'], (result) => {
      setDefaultAction(result.defaultAction ?? 'CHOOSE')
    })
  })
  if (showSettings) {
    return 'SETTINGS'
  }
  if (queue.length > 0) {
    // Show in progress downloads
    // ALWAYS
    return 'PROGRESS'
  }
  if (defaultAction === 'TABS' && tabPdfs.length > 0) {
    // If queue is empty, run default action immediately
    useEffect(() => {
      // initDownload(tabPdfs)
    }, [tabPdfs])
    return 'NOTHING'
  }
  if (defaultAction === 'LINKS' && pagePdfs.length > 0) {
    // If queue is empty, run default action immediately
    useEffect(() => {
      // initDownload(pagePdfs)
    }, [pagePdfs])
    return 'NOTHING'
  }
  if(complete) {
    return 'SUCCESS'
  }
  // Else show the buttons
  return 'BUTTONS'
}
export default useWhatToDisplay
