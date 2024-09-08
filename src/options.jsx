import React from 'react'
import { createRoot } from 'react-dom/client' // Import createRoot from react-dom/client
import Settings from './ui/Settings'

// Render the Popup component into the DOM
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(<Settings showHeading={true} />)
