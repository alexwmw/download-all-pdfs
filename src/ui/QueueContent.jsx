import TitledList from './TitledList'
import Spinner from './Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'

const QueueContent = ({ items, itemsMax, originalQueue }) => {
  const queueItems = originalQueue.map((tab, index) => {
    return (
      <li key={index}>
        {tab.finished ? (
          <FontAwesomeIcon
            style={{
              fontSize: '21px',
              color: 'darkslategray',
              marginInline: '2.5px',
            }}
            icon={faFileArrowDown}
          />
        ) : (
          <Spinner />
        )}
        <span title={tab.url}>{tab.title}</span>
      </li>
    )
  })
  const title = items.length
    ? `Initiating ${items.length} of ${itemsMax} download${items.length === 1 ? '' : 's'}`
    : `All downloads initiated`

  return <TitledList title={title} items={queueItems} />
}

export default QueueContent
