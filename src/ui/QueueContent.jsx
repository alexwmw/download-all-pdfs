import TitledList from './TitledList'
import Spinner from './Spinner'

const QueueContent = ({ items, itemsMax }) => {
  const queueItems = items.map((tab, index) => {
    return (
      <li key={index}>
        <Spinner />
        <span title={tab.url}>{tab.title}</span>
      </li>
    )
  })
  const title = `Downloading ${items.length} of ${itemsMax} item${items.length === 1 ? '' : 's'}`

  return <TitledList title={title} items={queueItems} />
}

export default QueueContent
