import classes from './Popup.module.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

const ActionList = ({ actions = [] }) => {
  const actionItems = actions.map((item) => {
    return (
      <li key={item.title} className={classes.popupActionItem}>
        <button
          disabled={item.disabled}
          className={classes.popupButton}
          onClick={item.action}
        >
          {item.title} <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <p onClick={item.showHelp} className={classes.popupTextLink}>
          What does this mean?
        </p>
      </li>
    )
  })
  return (
    <>
      <ul className={classes.popupActionList}>{actionItems}</ul>
    </>
  )
}

export default ActionList
