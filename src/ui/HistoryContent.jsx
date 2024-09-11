import TitledList from './TitledList'

const HistoryContent = ({ items }) => {
  const historyItems = items.map((tab, index) => {
    return (
      <li key={index}>
        <span title={tab.url}>
          <a href={tab.url} target={'_blank'}>
            {tab.title}
          </a>
        </span>
      </li>
    )
  })

  return (
    <>
      {items.length > 0 && (
        <TitledList title="Recently downloaded PDFs" items={historyItems} />
      )}
      {items.length === 0 && <p>No history</p>}
      {items.length > 99 && <p>Only last 100 are shown</p>}
    </>
  )
}

export default HistoryContent
