import { useEffect, useState } from 'react'
import { PrimaryButton, TertiaryButton } from './Buttons'
import classes from './Settings.module.less'

const Settings = ({ setClose }) => {
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
    const action = e.target.value
    setSettings((prevSettings) => ({
      ...prevSettings,
      defaultAction: action,
    }))
  }

  // Handle changes to the doClose checkbox
  const handleCloseChange = () => {
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
        console.log('Settings saved to Chrome storage!')
        if (setClose) setClose()
        else window.close()
      })
  }

  const ActionInput = ({ value, checked, label }) => (
    <div className={classes.flexRow}>
      <input
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
      <fieldset>
        <legend>
          <h4>Info</h4>
        </legend>
        <p>
          Settings can be changed later by right-clicking the extension button
          and selecting 'Options'.
        </p>
        <p>
          It is recommended that you set the Chrome setting{' '}
          <strong>Ask where to save each file before downloading</strong> to
          false when using this extension.
        </p>
        <p>
          <TertiaryButton
            onClick={() =>
              chrome.tabs.create({ url: 'chrome://settings/downloads' })
            }
          >
            Edit download settings
          </TertiaryButton>
        </p>
      </fieldset>
      <fieldset>
        <legend>
          <h4>Default action</h4>
        </legend>
        <h5>What should happen when you click the extension icon?</h5>
        <ActionInput
          value="TABS"
          checked={defaultAction === 'TABS'}
          label="Download all PDFs open in current tabs"
        />
        <ActionInput
          value="LINKS"
          checked={defaultAction === 'LINKS'}
          label="Download all PDFs links in the current page"
        />
        <ActionInput
          value="CHOOSE"
          checked={defaultAction === 'CHOOSE'}
          label="Choose what to do each time"
        />
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
          />
          <label htmlFor="CLOSE">
            Close PDF tabs after they have been downloaded
          </label>
        </div>
      </fieldset>
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          gap: '10px',
          marginTop: '15px',
        }}
      >
        <PrimaryButton role="submit" title="Save" />
        {setClose && <PrimaryButton title="Cancel" onClick={setClose} />}
      </div>
    </form>
  )
}

export default Settings
