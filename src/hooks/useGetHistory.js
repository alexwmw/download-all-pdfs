import { useEffect, useState } from 'react'

const useGetHistory = () => {
  const [history, setHistory] = useState([])
  useEffect(() => {
    chrome.storage.local.get(['history']).then((data) => {
      setHistory(data.history ?? [])
    })
  }, [setHistory])

  return { history }
}
export default useGetHistory
