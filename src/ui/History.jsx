import classes from './Popup.module.less'
import clsx from 'clsx'

const History = ({ history }) => {
  return (
    <div
      className={clsx(
        classes.inProgress,
        classes.history,
        classes.popupContainer
      )}
    >
      {history.length > 0 && (
        <ul>
          {history.map((tab, index) => {
            return (
              <li key={index}>
                <div title={tab.url} className={classes.text}>
                  <a href={tab.url} target={'_blank'}>
                    {tab.title}
                  </a>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {history.length === 0 && <p>No history</p>}
      {history.length > 99 && <p>Only last 100 are shown</p>}
    </div>
  )
}

export default History
