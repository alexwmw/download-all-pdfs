import { useEffect, useState } from 'react'

const useWhatToDisplay = ({
  queue,
  tabPdfs,
  pagePdfs,
  showSettings,
}) => {
  const [defaultAction, setDefaultAction] = useState()
  const [initiated, setInitiated] = useState(false)
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
  if (initiated) {
    return 'SUCCESS'
  }
  if (defaultAction === 'TABS' && tabPdfs.length > 0) {
    // If queue is empty, run default action immediately
    useEffect(() => {
      // initDownload(tabPdfs).then(()=>setInitiated(true)
    }, [tabPdfs])
    return 'NOTHING'
  }
  if (defaultAction === 'LINKS' && pagePdfs.length > 0) {
    // If queue is empty, run default action immediately
    useEffect(() => {
      // initDownload(pagePdfs).then(()=>setInitiated(true)
    }, [pagePdfs])
    return 'NOTHING'
  }
  // Else show the buttons
  return 'BUTTONS'
}
export default useWhatToDisplay
