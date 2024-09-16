import classes from './PopupContent.module.less'
import QueueContent from './QueueContent'
import HistoryContent from './HistoryContent'
import Settings from './Settings'
import MainButtons from './MainButtons'

const PopupContent = ({
  history,
  queue,
  queueMax,
  originalQueue,
  currentContent,
  download,
  closeSettings,
}) => {
  return (
    <div className={classes.popupContent}>
      {
        {
          SETTINGS: <Settings setClose={closeSettings} />,
          PROGRESS: (
            <QueueContent
              items={queue}
              itemsMax={queueMax}
              originalQueue={originalQueue}
            />
          ),
          BUTTONS: <MainButtons download={download} />,
          HISTORY: <HistoryContent items={history} />,
        }[currentContent]
      }
    </div>
  )
}

export default PopupContent
