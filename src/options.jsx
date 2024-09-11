import React from 'react'
import { createRoot } from 'react-dom/client' // Import createRoot from react-dom/client
import Settings from './ui/Settings'
import classes from './ui/Popup.module.less'

// Render the Popup component into the DOM
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(
  <div className={classes.optionsPage}>
    <h1 className={classes.popupTitle}>Download All PDFs - Options</h1>
    <Settings />
    <button className={classes.popupButton} onClick={() => window.close()}>
      Close
    </button>
  </div>
)
