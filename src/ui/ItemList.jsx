import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { TertiaryButton } from './Buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './ItemList.module.less'

const ItemList = ({ items, showItems, setShowItems }) => {
  const icon = showItems ? faCaretDown : faCaretRight
  return (
    <>
      <TertiaryButton onClick={() => setShowItems(!showItems)}>
        <FontAwesomeIcon icon={icon} /> Show Items
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
