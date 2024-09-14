import React from 'react'
import { createRoot } from 'react-dom/client' // Import createRoot from react-dom/client
import Settings from './ui/Settings'
import classes from './ui/Popup.module.less'
import PopupTitleBar from './ui/PopupTitleBar'

// Render the Popup component into the DOM
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(
  <div className={classes.options}>
    <PopupTitleBar />

    <Settings title={'Settings'} />
  </div>
)
