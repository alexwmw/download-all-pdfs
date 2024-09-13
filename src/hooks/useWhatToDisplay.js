import { useEffect, useState } from 'react'

const useWhatToDisplay = ({
  queue,
  tabPdfs,
  linkPdfs,
  showSettings,
  initiated,
}) => {
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
    return 'PROGRESS'
  }
  if (initiated) {
    return 'SUCCESS'
  }
  // if (defaultAction === 'TABS' && tabPdfs.length > 0) {
  //   return undefined
  // }
  // if (defaultAction === 'LINKS' && linkPdfs.length > 0) {
  //   return undefined
  // }
  // Else show the buttons
  return 'BUTTONS'
}
export default useWhatToDisplay
