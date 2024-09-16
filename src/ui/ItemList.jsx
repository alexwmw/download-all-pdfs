import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons'
import { TertiaryButton } from './Buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './ItemList.module.less'

const ItemList = ({ items, showItems, setShowItems }) => {
  const icon = showItems ? faCaretDown : faCaretRight
  const disabled = items.length === 0
  const title = disabled
    ? 'No PDFs found'
    : showItems
      ? 'Hide PDF names'
      : 'Show PDF names'
  return (
    <>
      <TertiaryButton
        disabled={disabled}
        onClick={() => setShowItems(!showItems)}
      >
        <FontAwesomeIcon icon={icon} /> {title}
      </TertiaryButton>
      {showItems && (
        <ul className={classes.itemList}>
          {items.map((item, index) => {
            return (
              <li key={index}>
                <a href={item.url} target="_blank">
                  {item.title}
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

export default ItemList
