import classes from './MainButtons.module.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import useGetCurrentPdfs from '../hooks/useGetCurrentPdfs'
import { DialogButton, PrimaryButton } from './Buttons'

const MainButtonListItem = ({ title, action, disabled, helpContent }) => {
  const [open, setOpen] = useState(false)
  return (
    <li key={title} className={classes.mainButtonListItem}>
      <PrimaryButton fullWidth={true} disabled={disabled} onClick={action}>
        <FontAwesomeIcon icon={disabled ? faFile : faFileArrowDown} />
        {title}
      </PrimaryButton>
      <DialogButton
        open={open}
        setOpen={() => setOpen(true)}
        setClosed={() => setOpen(false)}
        title="What does this mean?"
      >
        {helpContent}
      </DialogButton>
    </li>
  )
}

const MainButtons = ({ download }) => {
  const { tabPdfs, linkPdfs } = useGetCurrentPdfs()
  const [downloadItem, setDownloadItem] = useState(undefined)

  const tabsItem = {
    title: tabPdfs?.length
      ? `Download ${tabPdfs?.length || 'all'} PDF${tabPdfs?.length === 1 ? '' : 's'} open in current tabs`
      : 'No PDF tabs found',
    disabled: tabPdfs?.length === 0 ?? true,
    action: () => setDownloadItem(tabPdfs),
    helpContent: <p>Content</p>,
  }
  const linkItem = {
    title: linkPdfs?.length
      ? `Download ${linkPdfs?.length || 'all'} PDF link${linkPdfs?.length === 1 ? '' : 's'} found on page`
      : 'No PDF links found',
    disabled: linkPdfs?.length === 0 ?? true,
    action: () => setDownloadItem(linkPdfs),
    helpContent: <p>Content</p>,
  }

  download(downloadItem)

  return (
    <>
      <ul className={classes.mainButtons}>
        <MainButtonListItem {...tabsItem} />
        <MainButtonListItem {...linkItem} />
      </ul>
    </>
  )
}

export default MainButtons
