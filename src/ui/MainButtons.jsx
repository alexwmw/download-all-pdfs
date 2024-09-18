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
  // const linkItem = {
  //   title: linkPdfs?.length
  //     ? `Download ${linkPdfs?.length} PDF link${linkPdfs?.length === 1 ? '' : 's'} found on page`
  //     : 'Download PDFs links found on page',
  //
  //   disabled: linkPdfs?.length === 0 ?? true,
  //   action: () => initDownload(linkPdfs),
  //   items: linkPdfs,
  //   adviceTitle: 'No PDFs links found in current page',
  //   advice:
  //     "The extension could not find any PDFs links in the current page. PDF links are hyperlinks within a web page that point to a PDF resource. They are identified by a URL that ends in '.pdf'.",
  // }

  return (
    <ul className={classes.mainButtons}>
      <MainButtonListItem {...tabsItem} />
      {/*<MainButtonListItem {...linkItem} />*/}
    </ul>
  )
}

export default MainButtons
