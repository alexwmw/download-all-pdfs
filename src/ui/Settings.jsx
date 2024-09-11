import { useEffect, useState } from 'react'

const Settings = () => {
  const [defaultAction, setDefaultAction] = useState('CHOOSE')
  const [doClose, setDoClose] = useState(false)
  useEffect(() => {
    chrome.storage.local.get(['defaultAction', 'doClose']).then((result) => {
      if (result.defaultAction) {
        setDefaultAction(result.defaultAction)
      }
      if (result.doClose ?? true) {
        setDoClose(result.doClose ?? true)
      }
    })
  }, [setDefaultAction, setDoClose])

  const onOptionChange = (e) => {
    chrome.storage.local
      .set({ defaultAction: e.target.value })
      .then((result) => {
        setDefaultAction(e.target.value)
      })
  }

  const handleCloseChange = () => {
    chrome.storage.local.set({ doClose: !doClose }).then((result) => {
      setDoClose(!doClose)
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
          onChange={onOptionChange}
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
          <h4>
            Set the default action for the extension button when PDFs are found
          </h4>
        </legend>
        <ActionInput
          value="CHOOSE"
          label="Show the extension popup"
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
