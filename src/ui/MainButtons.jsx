import classes from './MainButtons.module.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import useGetCurrentPdfs from '../hooks/useGetCurrentPdfs'
import { DialogButton, PrimaryButton } from './Buttons'
import ItemList from './ItemList'
import HelpContent from './HelpContent'

const MainButtonListItem = ({ title, action, disabled, items }) => {
  const [showItems, setShowItems] = useState(false)
  return (
    <li key={title} className={classes.mainButtonListItem}>
      <PrimaryButton fullWidth={true} disabled={disabled} onClick={action}>
        <FontAwesomeIcon icon={faFileArrowDown} />
        {title}
      </PrimaryButton>
      {items.length > 0 && (
        <ItemList
          items={items}
          showItems={showItems}
          setShowItems={setShowItems}
        />
      )}
    </li>
  )
}

const MainButtons = ({ download }) => {
  const { tabPdfs, linkPdfs } = useGetCurrentPdfs()
  const [downloadItem, setDownloadItem] = useState(undefined)
  const [helpOpen, setHelpOpen] = useState(false)

  const tabsItem = {
    title: tabPdfs?.length
      ? `Download ${tabPdfs?.length || 'all'} PDF${tabPdfs?.length === 1 ? '' : 's'} open in current tabs`
      : 'No PDF tabs found',
    disabled: tabPdfs?.length === 0 ?? true,
    action: () => setDownloadItem(tabPdfs),
    items: tabPdfs,
  }
  const linkItem = {
    title: linkPdfs?.length
      ? `Download ${linkPdfs?.length || 'all'} PDF link${linkPdfs?.length === 1 ? '' : 's'} found on page`
      : 'No PDF links found',
    disabled: linkPdfs?.length === 0 ?? true,
    action: () => setDownloadItem(linkPdfs),
    items: linkPdfs,
  }

  download(downloadItem)

  return (
    <>
      <div className={classes.helpButtonContainer}>
        <DialogButton
          open={helpOpen}
          setOpen={() => setHelpOpen(true)}
          setClosed={() => setHelpOpen(false)}
          title="Help"
        >
          <HelpContent />
        </DialogButton>
      </div>
      <ul className={classes.mainButtons}>
        <MainButtonListItem {...tabsItem} />
        <MainButtonListItem {...linkItem} />
      </ul>
    </>
  )
}

export default MainButtons
