import classes from './PopupContent.module.less'
import Settings from './Settings'
import MainButtons from './MainButtons'
import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsSpin } from '@fortawesome/free-solid-svg-icons'

const DownloadsInProgress = ({ queue }) => {
  const download = queue?.length === 1 ? 'download' : 'downloads'
  return (
    <div
      className={clsx(
        classes.downloadsInProgress,
        queue?.length > 0 && classes.active
      )}
    >
      <p>
        <FontAwesomeIcon spin={true} icon={faArrowsSpin} />
        <span>{`${queue?.length} ${download} in progress`}</span>
      </p>
    </div>
  )
}

const PopupContent = ({ queue, closeSettings, showSettings }) => {
  return (
    <div className={classes.popupContent}>
      {showSettings ? (
        <Settings setClose={closeSettings} />
      ) : (
        <>
          <DownloadsInProgress queue={queue} />
          <MainButtons />
        </>
      )}
    </div>
  )
}

export default PopupContent
