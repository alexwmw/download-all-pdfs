import { useEffect, useState } from 'react'
import { getCurrentPdfTabs } from '../utility/utilities'

const useGetCurrentPdfs = () => {
  const [tabPdfs, setTabPdfs] = useState([])
  const [linkPdfs, setLinkPdfs] = useState([])
  const [queue, setQueue] = useState([])
  useEffect(() => {
    getCurrentPdfTabs().then((tabs) => {
      setTabPdfs(tabs)
    })
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'session' && changes.queue?.newValue) {
        setQueue(changes.queue?.newValue)
      }
    })
    chrome.tabs.onRemoved.addListener((tabId) => {
      const newPdfTabs = tabPdfs.filter((tab) => tab.id !== tabId)
      setTabPdfs([...newPdfTabs])
    })
  }, [setTabPdfs, setQueue])

  return { tabPdfs, linkPdfs, queue }
}

export default useGetCurrentPdfs
