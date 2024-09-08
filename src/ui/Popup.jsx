import { useEffect, useState } from 'react'
import classes from './Popup.module.less'
import ActionList from './ActionList'
import HelpDialog from './HelpDialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackwardStep, faCog } from '@fortawesome/free-solid-svg-icons'
import Settings from './Settings'

async function getCurrentPdfTabs() {
  let queryOptions = {
    url: ['http://*/*.pdf', 'https://*/*.pdf'],
  }
  return await chrome.tabs.query(queryOptions)
}

async function initDownload(tabs) {
  return await chrome.runtime.sendMessage({
    action: 'download',
    tabs,
  })
}

const Popup = () => {
  const [initiated, setInitiated] = useState(false)
  const [tabPdfs, setTabPdfs] = useState([])
  const [pagePdfs, setPagePdfs] = useState([])
  const [queue, setQueue] = useState([])
  const [help, setHelp] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    getCurrentPdfTabs().then((tabs) => {
      setTabPdfs(tabs)
    })
    chrome.storage.session.get('queue').then((data) => {
      setQueue(data.queue ?? [])
    })
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'session' && changes.queue?.newValue) {
        setQueue(changes.queue?.newValue)
        if (changes.queue?.newValue.length === 0) {
          window.close()
        }
      }
    })
    chrome.tabs.onRemoved.addListener((tabId) => {
      const newPdfTabs = tabPdfs.filter((tab) => tab.id !== tabId)
      setTabPdfs([...newPdfTabs])
    })
  }, [setTabPdfs, setQueue, initiated])

  const actions = [
    {
      id: 'TABS',
      title: 'Download all PDFs open in current tabs',
      disabled: tabPdfs?.length === 0 ?? true,
      action: () => {
        setInitiated(true)
        const success = initDownload(tabPdfs)
        if (success) console.log('Downloading all open PDFs.')
      },
      showHelp: () => setHelp(1),
    },
    {
      id: 'LINKS',
      title: 'Download all PDF links in the current page',
      disabled: pagePdfs?.length === 0 ?? true,
      action: () => console.log('Action 2 clicked'),
      showHelp: () => setHelp(2),
    },
  ]

  return (
    <>
      <h1 className={classes.popupTitle}>
        Download All PDFs
        <button
          title={'Toggle show settings'}
          onClick={() => setShowSettings(!showSettings)}
          tabIndex={1}
          className={classes.popupIconButton}
        >
          <FontAwesomeIcon icon={showSettings ? faBackwardStep : faCog} />
        </button>
      </h1>
      {showSettings ? (
        <Settings />
      ) : (
        <div className={classes.popupContainer}>
          {!initiated && queue.length === 0 && <ActionList actions={actions} />}
          {queue.length > 0 && (
            <div className={classes.inProgress}>
              <p>Downloads in progress:</p>
              <ul>
                {queue.map((tab, index) => {
                  return (
                    <li key={index}>
                      <div className={classes.spinner} />
                      <div title={tab.url} className={classes.text}>
                        {tab.url.split('//')[1]}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {actions.map(({ title, id }, index) => {
            return (
              <HelpDialog
                key={{ id }}
                title={title}
                helpId={index + 1}
                currentHelp={help}
                onClose={() => setHelp(0)}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

export default Popup
