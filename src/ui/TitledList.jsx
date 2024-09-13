import classes from './TitledList.module.less'
import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TitledList = ({ title, items, icon }) => {
  return (
    <div className={clsx(classes.titledList)}>
      <h3>
        {icon && <FontAwesomeIcon icon={icon} />}
        {title}
      </h3>
      <ul>{items}</ul>
    </div>
  )
}
export default TitledList
