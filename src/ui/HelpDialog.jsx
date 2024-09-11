import classes from './Popup.module.less'

const HelpDialog = ({ title, showHelp, onClose }) => {
  return (
    <dialog open={showHelp} onClose={onClose}>
      <div>
        <h3>'{title}'</h3>
        <p>
          Select this action to download each PDF that is currently open in an
          individual tab.
        </p>
        <p>
          Only tabs with a URL that starts with "http(s)" and ends in ".pdf"
          will be downloaded.
        </p>
        <p>If no PDF containing tabs are found, the button will be disabled.</p>
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
