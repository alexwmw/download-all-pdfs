import PopupTitleBar from './PopupTitleBar'
import PopupContent from './PopupContent'
import useGetCurrentPdfs from '../hooks/useGetCurrentPdfs'
import useGetHistory from '../hooks/useGetHistory'
import { useState } from 'react'
import useWhatToDownload from '../hooks/useWhatToDownload'
import useWhatToDisplay from '../hooks/useWhatToDisplay'
import useInitDownload from '../hooks/useInitDownload'
import { TertiaryButton } from './Buttons'
import classes from './Popup.module.less'

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

  const settingButton = (
    <TertiaryButton
      onClick={() => setShowSettings(!showSettings)}
      title={showSettings ? 'Close settings' : 'Change settings'}
    />
  )

  return (
    <div className={classes.popup}>
      <PopupTitleBar title={'Download All PDFs'} buttons={settingButton} />
      <PopupContent
        currentContent={WHAT_TO_DISPLAY}
        queue={queue}
        history={history}
        initiated={initiated}
        download={download}
      />
    </div>
  )
}

export default Popup
