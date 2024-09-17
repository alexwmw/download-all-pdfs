import PopupTitleBar from './PopupTitleBar'
import PopupContent from './PopupContent'
import useGetCurrentPdfs from '../hooks/useGetCurrentPdfs'
import useGetHistory from '../hooks/useGetHistory'
import { useEffect, useState } from 'react'
import useWhatToDownload from '../hooks/useWhatToDownload'
import useWhatToDisplay from '../hooks/useWhatToDisplay'
import useInitDownload from '../hooks/useInitDownload'
import { TertiaryButton } from './Buttons'
import classes from './Popup.module.less'
import clsx from 'clsx'

const Popup = () => {
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    chrome.storage.session.clear()
  }, [])

  const settingButton = !showSettings && (
    <TertiaryButton
      onClick={() => setShowSettings(!showSettings)}
      title={'Change settings'}
    />
  )

  return (
    <div className={clsx(classes.popup)}>
      <PopupTitleBar title={'Download All PDFs'} buttons={settingButton} />
      <PopupContent
        queue={queue}
        showSettings={showSettings}
        closeSettings={() => setShowSettings(false)}
      />
    </div>
  )
}

export default Popup
