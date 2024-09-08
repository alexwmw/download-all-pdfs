import classes from './Popup.module.less'
import { useEffect, useState } from 'react'

const Settings = ({ showHeading }) => {
  const [defaultAction, setDefaultAction] = useState(null)
  const [doClose, setDoClose] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(['defaultAction', 'doClose']).then((result) => {
      if (result.defaultAction) {
        setDefaultAction(result.defaultAction)
      }
      if (result.doClose) {
        setDoClose(result.doClose)
      }
    })
  }, [setDefaultAction, setDoClose])

  const onOptionChange = (e) => {
    if (e.target.value === 'NONE') {
      chrome.storage.local.set({ defaultAction: null }).then((result) => {
        setDefaultAction(null)
      })
    } else {
      chrome.storage.local
        .set({ defaultAction: e.target.value })
        .then((result) => {
          setDefaultAction(e.target.value)
        })
    }
  }

  const handleCloseChange = () => {
    chrome.storage.local.set({ doClose: !doClose }).then((result) => {
      setDoClose(!doClose)
    })
  }

  return (
    <div className={classes.optionsPage}>
      {showHeading && (
        <h1 className={classes.popupTitle}>Download All PDFs - Options</h1>
      )}
      <div className={classes.popupContainer}>
        <form>
          <legend>
            <h4>Set default action when clicking the extension</h4>
          </legend>
          <input
            type="radio"
            name={'defaultAction'}
            id="NONE"
            value="NONE"
            checked={defaultAction === null}
            onChange={onOptionChange}
          />
          <label htmlFor="NONE">Choose which action to perform</label>
          <br />
          <input
            type="radio"
            name={'defaultAction'}
            id="TABS"
            value="TABS"
            checked={defaultAction === 'TABS'}
            onChange={onOptionChange}
          />
          <label htmlFor="TABS">Download all PDF tabs</label>
          <br />
          <input
            type="radio"
            name={'defaultAction'}
            id="LINKS"
            value="LINKS"
            checked={defaultAction === 'LINKS'}
            onChange={onOptionChange}
          />
          <label htmlFor="LINKS">Download all PDF links</label>
          <p>
            This setting can be change later by right clicking the Extension
            button and selecting 'Options'.
          </p>

          <input
            onChange={handleCloseChange}
            id="CLOSE"
            checked={doClose}
            type={'checkbox'}
          />
          <label htmlFor={'CLOSE'}>
            Close PDF tabs after they have been downloaded
          </label>
        </form>
      </div>
      {showHeading && (
        <button className={classes.popupButton} onClick={() => window.close()}>
          Close
        </button>
      )}
    </div>
  )
}

export default Settings
