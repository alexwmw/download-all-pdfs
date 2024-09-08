import classes from './Popup.module.less'

const HelpDialog = ({ title, helpId, currentHelp, onClose }) => {
  const content1 = (
    <>
      <p>
        Select this action to download each PDF that is currently open in an
        individual tab.
      </p>
      <p>
        Only tabs with a URL that starts with "http(s)" and ends in ".pdf" will
        be downloaded.
      </p>
      <p>If no PDF containing tabs are found, the button will be disabled.</p>
    </>
  )
  const content2 = (
    <>
      <p>
        Select this action to download every link on the current webpage that
        links to a PDF file.
      </p>
      <p>
        Only links with a URL that starts with "http(s)" and ends in ".pdf" will
        be downloaded.
      </p>
      <p>If no PDF containing links are found, the button will be disabled.</p>
    </>
  )
  return (
    <dialog open={currentHelp === helpId} onClose={onClose}>
      <div className={classes.content}>
        <h3>'{title}'</h3>
        {helpId === 1 && content1}
        {helpId === 2 && content2}
      </div>
      <div className={classes.buttons}>
        <form method="dialog">
          <button className={classes.popupButton}>Close</button>
        </form>
      </div>
    </dialog>
  )
}

export default HelpDialog
