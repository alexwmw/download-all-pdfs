import { useEffect, useState } from 'react'

const Settings = () => {
  const [settings, setSettings] = useState({})
  const { doClose, defaultAction } = settings
  useEffect(() => {
    chrome.storage.local.get(['defaultAction', 'doClose']).then((result) => {
      setSettings({
        defaultAction: result.defaultAction ?? 'CHOOSE',
        doClose: result.doClose ?? true,
      })
    })
  }, [setSettings])

  const handleChangeDefaultAction = (e) => {
    const action = e.target.value
    chrome.storage.local.set({ defaultAction: action }).then(() => {
      setSettings((settings) => ({
        ...settings,
        defaultAction: action,
      }))
    })
  }

  const handleCloseChange = () => {
    chrome.storage.local.set({ doClose: !doClose }).then(() => {
      setSettings((settings) => ({ ...settings, doClose: !doClose }))
    })
  }

  const ActionInput = ({ value, checked, label }) => {
    return (
      <>
        <input
          type="radio"
          name={'defaultAction'}
          id={value}
          value={value}
          checked={checked}
          onChange={handleChangeDefaultAction}
        />
        <label htmlFor={value}> {label}</label>
        <br />
      </>
    )
  }

  return (
    <form>
      <fieldset>
        <legend>
          <h4>Default action for the extension button</h4>
        </legend>
        <ActionInput
          value="CHOOSE"
          label="Choose what to do each time"
          checked={defaultAction === 'CHOOSE'}
        />
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
      </fieldset>

      <fieldset>
        <legend>
          <h4>Options</h4>
        </legend>
        <input
          onChange={handleCloseChange}
          id="CLOSE"
          checked={doClose}
          type={'checkbox'}
        />
        <label htmlFor={'CLOSE'}>
          Close PDF tabs after they have been downloaded
        </label>
      </fieldset>
    </form>
  )
}

export default Settings
