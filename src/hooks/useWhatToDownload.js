import { useEffect, useState } from 'react'

const useWhatToDownload = ({ tabPdfs, linkPdfs }) => {
  const [defaultAction, setDefaultAction] = useState()
  useEffect(() => {
    chrome.storage.local.get(['defaultAction'], (result) => {
      setDefaultAction(result.defaultAction ?? 'CHOOSE')
    })
  })
  if (defaultAction === 'TABS' && tabPdfs.length > 0) {
    return tabPdfs
  }
  if (defaultAction === 'LINKS' && linkPdfs.length > 0) {
    return linkPdfs
  }
  // Else show the buttons
  return undefined
}
export default useWhatToDownload
