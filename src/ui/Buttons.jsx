import classes from './Buttons.module.less'
import clsx from 'clsx'

const Button = ({ children, onClick, disabled, fullWidth, title, type }) => {
  return (
    <button
      tabIndex={1}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        classes.button,
        classes[type],
        fullWidth && classes.fullWidth
      )}
    >
      {title}
      {children}
    </button>
  )
}
export const PrimaryButton = (props) => {
  return <Button type={'primary'} {...props} />
}
export const TertiaryButton = (props) => {
  return <Button type={'tertiary'} {...props} />
}
