import { useCallback, useEffect, useState } from 'react'
import { initDownload } from '../utility/utilities'

const useInitDownload = (downloadItem) => {
  const [initiated, setInitiated] = useState(false)
  const download = useCallback(
    (item) => {
      if (item) {
        initDownload(item).then((data) => {
          setInitiated(true)
        })
      }
    },
    [setInitiated]
  )

  useEffect(() => {
    download(downloadItem)
  }, [downloadItem])
  return { initiated, download }
}

export default useInitDownload
