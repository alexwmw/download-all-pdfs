import classes from './PopupTitleBar.module.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TertiaryButton } from './Buttons'

const PopupIconButton = ({ title, onClick, icon }) => {
  return (
    <button
      title={title}
      onClick={onClick}
      tabIndex={1}
      className={classes.popupIconButton}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  )
}

const PopupTitleBar = ({ title }) => {
  return (
    <h1 className={classes.popupTitleBar}>
      {title}
      <div>
        <TertiaryButton title="Change default action" />
      </div>
    </h1>
  )
}

export default PopupTitleBar
