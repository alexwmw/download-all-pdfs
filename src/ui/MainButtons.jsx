import classes from './MainButtons.module.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'
import useGetCurrentPdfs from '../hooks/useGetCurrentPdfs'
import { PrimaryButton, TertiaryButton } from './Buttons'
import useInitDownload from '../hooks/useInitDownload'

const MainButtonListItem = ({ title, onClick, disabled }) => {
  return (
    <li key={title} className={classes.mainButtonListItem}>
      <PrimaryButton fullWidth={true} disabled={disabled} onClick={onClick}>
        <FontAwesomeIcon icon={disabled ? faFile : faFileArrowDown} />
        {title}
      </PrimaryButton>
      <TertiaryButton title="What does this mean?" onClick={() => {}} />
    </li>
  )
}

const MainButtons = ({ download }) => {
  const { tabPdfs, linkPdfs } = useGetCurrentPdfs()
  const [downloadItem, setDownloadItem] = useState(undefined)

  const tabsItem = {
    title: `Download ${tabPdfs?.length || 'all'} PDF${tabPdfs?.length === 1 ? '' : 's'} open in current tabs`,
    disabled: tabPdfs?.length === 0 ?? true,
    onClick: () => setDownloadItem(tabPdfs),
  }
  const linkItem = {
    title: `Download ${linkPdfs?.length || 'all'} PDF link${linkPdfs?.length === 1 ? '' : 's'} in the current page`,
    disabled: linkPdfs?.length === 0 ?? true,
    onClick: () => setDownloadItem(linkPdfs),
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
