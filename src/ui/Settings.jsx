import { useEffect, useState } from 'react'
import { PrimaryButton, TertiaryButton } from './Buttons'
import classes from './Settings.module.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'

const Settings = ({ setClose, title }) => {
  const [hasChanges, setHasChanges] = useState(false)
  const [settings, setSettings] = useState({
    defaultAction: 'CHOOSE',
    doClose: true,
  })
  const { doClose, defaultAction } = settings

  // Load settings from Chrome storage when the component mounts
  useEffect(() => {
    chrome.storage.local.get(['defaultAction', 'doClose']).then((result) => {
      setSettings({
        defaultAction: result.defaultAction ?? 'CHOOSE',
        doClose: result.doClose ?? true,
      })
    })
  }, [])

  // Handle changes to the defaultAction
  const handleChangeDefaultAction = (e) => {
    setHasChanges(true)
    const action = e.target.value
    setSettings((prevSettings) => ({
      ...prevSettings,
      defaultAction: action,
    }))
  }

  // Handle changes to the doClose checkbox
  const handleCloseChange = () => {
    setHasChanges(true)
    setSettings((prevSettings) => ({
      ...prevSettings,
      doClose: !prevSettings.doClose,
    }))
  }

  // Handle form submission: Save all settings to Chrome storage
  const handleSubmit = (e) => {
    e.preventDefault()

    chrome.storage.local
      .set({
        defaultAction: settings.defaultAction,
        doClose: settings.doClose,
      })
      .then(() => {
        if (setClose === undefined) window.close()
        else if (setClose && settings.defaultAction !== 'CHOOSE') window.close()
        else {
          setClose()
        }
      })
  }

  const ActionInput = ({ value, checked, label }) => (
    <div className={clsx(classes.flexRow, classes.actionInput)}>
      <input
        tabIndex={1}
        type="radio"
        name="defaultAction"
        id={value}
        value={value}
        checked={checked}
        onChange={handleChangeDefaultAction}
      />
      <label htmlFor={value}>{label}</label>
      <br />
    </div>
  )

  return (
    <form className={classes.settings} onSubmit={handleSubmit}>
      {title && <h2>{title}</h2>}
      <fieldset className={classes.tip}>
        <legend>
          <h4>Tips</h4>
        </legend>
        <p>
          It is recommended that you set{' '}
          <strong>'Ask where to save each file before downloading'</strong> to
          false when using this extension.
        </p>
        <p>
          <TertiaryButton
            onClick={() =>
              chrome.tabs.create({ url: 'chrome://settings/downloads' })
            }
          >
            <div className={classes.flexRow}>
              <FontAwesomeIcon icon={faExternalLinkAlt} />
              <span>Edit download settings</span>
            </div>
          </TertiaryButton>
        </p>
      </fieldset>
      <fieldset>
        <legend>
          <h4>Default action</h4>
        </legend>
        <h5>What should happen when you click the extension icon?</h5>{' '}
        <ActionInput
          value="CHOOSE"
          checked={defaultAction === 'CHOOSE'}
          label="Choose what to do each time"
        />
        <ActionInput
          value="TABS"
          checked={defaultAction === 'TABS'}
          label="Download all PDFs open in current tabs*"
        />
        <ActionInput
          value="LINKS"
          checked={defaultAction === 'LINKS'}
          label="Download all PDFs links in the current page*"
        />
        <p style={{ fontSize: '11px' }}>
          * If there are no PDFs available, the popup will display instead.
        </p>
      </fieldset>

      <fieldset>
        <legend>
          <h4>Options</h4>
        </legend>
        <div className={classes.flexRow}>
          <input
            onChange={handleCloseChange}
            id="CLOSE"
            checked={doClose}
            type="checkbox"
            tabIndex={1}
          />
          <label htmlFor="CLOSE" style={{ fontWeight: 500 }}>
            Close PDF tabs after they have been downloaded
          </label>
        </div>
      </fieldset>
      <div className={classes.buttonFlexRow}>
        <PrimaryButton disabled={!hasChanges} type="submit" title="Save" />
        {setClose && (
          <PrimaryButton type={'button'} title="Back" onClick={setClose} />
        )}
      </div>
    </form>
  )
}

export default Settings
