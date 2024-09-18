import { useEffect, useState } from 'react'
import { getActiveTab, getCurrentPdfTabs } from '../utility/utilities'

const useGetCurrentPdfs = () => {
  const [tabPdfs, setTabPdfs] = useState([])
  const [queue, setQueue] = useState([])
  const [activeTab, setActiveTab] = useState(null)

  useEffect(() => {
    Promise.all([getCurrentPdfTabs(), getActiveTab()]).then(([tabs, tab]) => {
      setTabPdfs(tabs)
      setActiveTab(tab)
    })
  }, [])

  useEffect(() => {
    const handleStorageChange = (changes, area) => {
      if (area === 'session' && changes.queue?.newValue) {
        setQueue(changes.queue?.newValue)
      }
    }

    const handleTabRemoval = (tabId) => {
      setTabPdfs((prevPdfs) => prevPdfs.filter((tab) => tab.id !== tabId))
    }

    // Add storage and tab listeners
    chrome.storage.onChanged.addListener(handleStorageChange)
    chrome.tabs.onRemoved.addListener(handleTabRemoval)

    // Cleanup event listeners on unmount or effect rerun
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
      chrome.tabs.onRemoved.removeListener(handleTabRemoval)
    }
  }, [activeTab, tabPdfs])

  return { tabPdfs, queue }
}

export default useGetCurrentPdfs
