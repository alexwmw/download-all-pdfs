import TitledList from './TitledList'
import classes from './ErrorsContent.module.less'
import { faWarning } from '@fortawesome/free-solid-svg-icons'

const ErrorsContent = ({ errors }) => {
  const items = errors.map((tab, index) => {
    return (
      <li key={index}>
        <span>
          Download failed:{' '}
          <a href={tab.url} target={'_blank'}>
            link to PDF
          </a>
        </span>
      </li>
    )
  })
  const title = `Error`

  return (
    items.length > 0 && (
      <div className={classes.errorsContent}>
        <TitledList title={title} items={items} icon={faWarning} />
      </div>
    )
  )
}

export default ErrorsContent
