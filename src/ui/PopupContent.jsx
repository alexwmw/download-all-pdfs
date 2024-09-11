import classes from './Popup.module.less'
import QueueContent from './QueueContent'
import HistoryContent from './HistoryContent'
import Settings from './Settings'
import MainButtons from './MainButtons'

const PopupContent = ({ history, queue, currentContent, download }) => {
  let content
  switch (currentContent) {
    case 'SETTINGS':
      content = <Settings />
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
  return <div className={classes.popupContainer}>{content}</div>
}

export default PopupContent
