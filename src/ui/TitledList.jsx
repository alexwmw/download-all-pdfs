import classes from './TitledList.module.less'

const TitledList = ({ title, items }) => {
  return (
    <div className={classes.titledList}>
      <h3>{title}</h3>
      <ul>{items}</ul>
    </div>
  )
}
export default TitledList
