import PopupTitleBar from './PopupTitleBar'
import PopupContent from './PopupContent'
import useGetCurrentPdfs from '../hooks/useGetCurrentPdfs'
import useGetHistory from '../hooks/useGetHistory'
import { useState } from 'react'
import useWhatToDownload from '../hooks/useWhatToDownload'
import useWhatToDisplay from '../hooks/useWhatToDisplay'
import useInitDownload from '../hooks/useInitDownload'

const Popup = () => {
  const [showSettings, setShowSettings] = useState(false)
  const { tabPdfs, linkPdfs, queue } = useGetCurrentPdfs()
  const { history } = useGetHistory()
  const downloadItem = useWhatToDownload({ tabPdfs, linkPdfs })

  const { initiated, download } = useInitDownload(downloadItem)

  const WHAT_TO_DISPLAY = useWhatToDisplay({
    queue,
    tabPdfs,
    linkPdfs,
    showSettings,
    initiated,
  })

  return (
    <>
      <PopupTitleBar title={'Download All PDFs'} />
      <PopupContent
        currentContent={WHAT_TO_DISPLAY}
        queue={queue}
        history={history}
        initiated={initiated}
        download={download}
      />
    </>
  )
}

export default Popup
