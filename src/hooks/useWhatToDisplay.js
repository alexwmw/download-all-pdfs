import { useEffect, useState } from 'react'

const useWhatToDisplay = ({ queue, showSettings, initiated }) => {
  if (showSettings) {
    return 'SETTINGS'
  }
  if (queue.length > 0 || initiated) {
    return 'PROGRESS'
  }
  return 'BUTTONS'
}
export default useWhatToDisplay
