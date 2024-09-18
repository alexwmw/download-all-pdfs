import classes from './MainButtons.module.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import useGetCurrentPdfs from '../hooks/useGetCurrentPdfs'
import { PrimaryButton, SecondaryButton } from './Buttons'
import ItemList from './ItemList'
import { initDownload } from '../utility/utilities'

const MainButtonListItem = ({
  title,
  action,
  disabled,
  items,
  adviceTitle,
  advice,
}) => {
  const [showItems, setShowItems] = useState(false)
  const [showAdvice, setShowAdvice] = useState(false)
  return (
    <li key={title} className={classes.mainButtonListItem}>
      <PrimaryButton
        fullWidth={true}
        className={disabled && classes.disabled}
        onClick={disabled ? () => setShowAdvice(true) : action}
      >
        <FontAwesomeIcon icon={faFileArrowDown} />
        {title}
      </PrimaryButton>
      <ItemList
        items={items}
        showItems={showItems}
        setShowItems={setShowItems}
      />
      <dialog open={showAdvice} onClose={() => setShowAdvice(false)}>
        <div>
          <div>
            <h3>{adviceTitle}</h3>
            {advice.split(/(?<=\. )/).map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <div>
            <form method="dialog">
              <SecondaryButton title={'Close'} />
            </form>
          </div>
        </div>
      </dialog>
    </li>
  )
}

const MainButtons = ({}) => {
  const { tabPdfs, linkPdfs } = useGetCurrentPdfs()

  const tabsItem = {
    title: tabPdfs?.length
      ? `Download ${tabPdfs?.length} PDF${tabPdfs?.length === 1 ? '' : 's'} open in current tabs`
      : 'Download PDFs open in current tabs',

    disabled: tabPdfs?.length === 0 ?? true,
    action: () => initDownload(tabPdfs),
    items: tabPdfs,
    adviceTitle: 'No PDFs found open in current tabs',
    advice:
      "The extension could not find any PDFs open in current tabs. PDF tabs are tabs that display the PDF viewer, and often have a URL ending in '.pdf'.",
  }

  return (
    <ul className={classes.mainButtons}>
      <MainButtonListItem {...tabsItem} />
    </ul>
  )
}

export default MainButtons
