import classes from './PopupContent.module.less'
import Settings from './Settings'
import MainButtons from './MainButtons'
import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsSpin, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

const DownloadsInProgress = ({ queue }) => {
  const [complete, setComplete] = useState(null)
  const noQueue = queue?.length === 0 ?? true
  const download = queue?.length === 1 ? 'download' : 'downloads'
  const title = noQueue
    ? 'Downloading complete'
    : `${queue?.length} ${download} in progress`

  useEffect(() => {
    if (complete === null && !noQueue) setComplete(false)
    if (complete === false && noQueue) {
      setTimeout(() => {
        setComplete(true)
      }, [1000])
    }
  }, [queue, complete])

  return (
    <div
      className={clsx(
        classes.downloadsInProgress,
        complete === false && classes.active
      )}
    >
      <p>
        <FontAwesomeIcon
          spin={!noQueue}
          icon={noQueue ? faCheck : faArrowsSpin}
        />
        <span>{title}</span>
      </p>
    </div>
  )
}

const Errors = ({ errors }) => {
  console.log(errors)
  return (
    errors.length > 0 && (
      <div className={classes.errors}>
        <hr />
        <h4>Errors encountered during download</h4>
        <ul>
          {errors.map((err, index) => {
            return (
              <li key={index}>
                {err.msg} | {err.url}
              </li>
            )
          })}
        </ul>
      </div>
    )
  )
}
const PopupContent = ({
  queue,
  closeSettings,
  showSettings,
  errors,
  resetErrors,
}) => {
  return (
    <div className={classes.popupContent}>
      {showSettings ? (
        <Settings setClose={closeSettings} />
      ) : (
        <>
          <DownloadsInProgress queue={queue} />
          <MainButtons resetErrors={resetErrors} />
          <Errors errors={errors} />
        </>
      )}
    </div>
  )
}

export default PopupContent
