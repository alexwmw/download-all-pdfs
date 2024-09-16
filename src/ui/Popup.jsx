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
import useGetErrors from '../hooks/useGetErrors'
import ErrorsContent from './ErrorsContent'
import clsx from 'clsx'

const Popup = () => {
  const [showSettings, setShowSettings] = useState(false)
  const { tabPdfs, linkPdfs, queue } = useGetCurrentPdfs()
  const { history } = useGetHistory()
  const { errors } = useGetErrors()
  const downloadItem = useWhatToDownload({ tabPdfs, linkPdfs })
  const [queueMax, setQueueMax] = useState(0)
  const [originalQueue, setOriginQueue] = useState([])

  const { initiated, download } = useInitDownload(downloadItem)

  const findQueueMax = (queueMax) => {
    const [a, b] = [queue.length ?? 0, queueMax ?? 0]
    return a > b ? a : b
  }
  useEffect(() => setQueueMax(findQueueMax))

  const WHAT_TO_DISPLAY = useWhatToDisplay({
    queue,
    showSettings,
    initiated,
  })

  useEffect(() => {
    if (queue.length > originalQueue.length) setOriginQueue([...queue])
    else {
      setOriginQueue((q) => {
        const newQ = [...q]
        for (const item of newQ) {
          if (!item.finished) {
            item.finished = true
            break
          }
        }
        return newQ
      })
    }
  }, [queue])

  const settingButton = !showSettings && (
    <TertiaryButton
      onClick={() => setShowSettings(!showSettings)}
      title={'Change settings'}
    />
  )

  return (
    <div className={clsx(classes.popup)}>
      <PopupTitleBar title={'Download All PDFs'} buttons={settingButton} />
      <ErrorsContent errors={errors} />
      <PopupContent
        currentContent={WHAT_TO_DISPLAY}
        queue={queue}
        originalQueue={originalQueue}
        queueMax={queueMax}
        history={history}
        errors={errors}
        download={download}
        closeSettings={() => setShowSettings(false)}
      />
    </div>
  )
}

export default Popup
