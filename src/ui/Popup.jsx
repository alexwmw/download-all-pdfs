import PopupTitleBar from './PopupTitleBar'
import PopupContent from './PopupContent'
import { useEffect, useState } from 'react'
import { TertiaryButton } from './Buttons'
import classes from './Popup.module.less'
import clsx from 'clsx'
import useGetCurrentPdfs from '../hooks/useGetCurrentPdfs'

const Popup = () => {
  const [showSettings, setShowSettings] = useState(false)
  const { queue } = useGetCurrentPdfs()
  const [errors, setErrors] = useState([])

  useEffect(() => {
    const errorListener = (request) => {
      if (request.action === 'addError')
        setErrors((err) => [
          ...err,
          { msg: request.error, url: request.item.url.slice(0, 50) },
        ])
    }
    chrome.runtime.onMessage.addListener(errorListener)

    return () => {
      chrome.runtime.onMessage.removeListener(errorListener)
    }
  })

  const settingButton = !showSettings && (
    <TertiaryButton
      onClick={() => setShowSettings(!showSettings)}
      title={'Change settings'}
    />
  )

  const resetErrors = () => setErrors([])

  return (
    <div className={clsx(classes.popup)}>
      <PopupTitleBar title={'Download All PDFs'} buttons={settingButton} />
      <PopupContent
        queue={queue}
        errors={errors}
        resetErrors={resetErrors}
        showSettings={showSettings}
        closeSettings={() => setShowSettings(false)}
      />
    </div>
  )
}

export default Popup
