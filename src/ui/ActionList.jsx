import classes from './Popup.module.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

const ActionList = ({ actions = [] }) => {
  const actionItems = actions.map((item, index) => {
    return (
      <li key={item.title} className={classes.popupActionItem}>
        <button
          tabIndex={index * 2 + 1}
          disabled={item.disabled}
          className={classes.popupButton}
          onClick={item.action}
        >
          {item.title}
          <FontAwesomeIcon icon={faFileArrowDown} />
        </button>
        <button
          tabIndex={index * 2 + 2}
          onClick={item.showHelp}
          className={classes.popupTextLink}
        >
          What does this mean?
        </button>
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
