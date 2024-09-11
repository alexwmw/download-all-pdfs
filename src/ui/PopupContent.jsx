import classes from './PopupContent.module.less'
import QueueContent from './QueueContent'
import HistoryContent from './HistoryContent'
import Settings from './Settings'
import MainButtons from './MainButtons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const PopupContent = ({ history, queue, currentContent, download }) => {
  let content
  switch (currentContent) {
    case 'SETTINGS':
      content = (
        <>
          <Settings />
          <br />
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faInfoCircle} />
            <p>
              Settings can be changed later by right-clicking the extension
              button and selection 'Options'.
            </p>
          </div>
        </>
      )
      break
    case 'PROGRESS':
      content = <QueueContent items={queue} />
      break
    case 'SUCCESS':
      content = <></>
      break
    case 'BUTTONS':
      content = <MainButtons download={download} />
      break
    case 'HISTORY':
      content = <HistoryContent items={history} />
      break
    default:
      content = null
  }
  return <div className={classes.popupContent}>{content}</div>
}

export default PopupContent
