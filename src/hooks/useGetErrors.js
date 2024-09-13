import { useEffect, useState } from 'react'

const useGetErrors = () => {
  const [errors, setErrors] = useState([])
  useEffect(() => {
    chrome.storage.local.get(['errors']).then((data) => {
      setErrors(data.errors ?? [])
    })
    window.onbeforeunload = () => {
      chrome.storage.local.set({ errors: [] })
    }
  }, [setErrors])

  return { errors }
}
export default useGetErrors
