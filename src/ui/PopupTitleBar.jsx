import classes from './PopupTitleBar.module.less'

const ExtImage = ({ ...props }) => {
  return <img src={'./48.png'} alt={'DownloadAllPdfs logo'} {...props} />
}

const PopupTitleBar = ({ title = 'Download All PDFs', buttons }) => {
  return (
    <h1 className={classes.popupTitleBar}>
      <div
        style={{
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        }}
      >
        <ExtImage className={classes.extImage} height={'24px'} />
        {title}
      </div>
      <div>{buttons}</div>
    </h1>
  )
}

export default PopupTitleBar
