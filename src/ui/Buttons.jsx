import classes from './Buttons.module.less'
import clsx from 'clsx'

const Button = ({
  children,
  onClick,
  disabled,
  fullWidth,
  isDialogButton,
  title,
  type,
  ...props
}) => {
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
      {...props}
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
export const SecondaryButton = (props) => {
  return <Button type={'secondary'} {...props} />
}

export const DialogButton = ({
  title,
  children,
  open,
  setOpen,
  setClosed,
  ...props
}) => {
  return (
    <>
      <TertiaryButton
        title={title}
        onClick={setOpen}
        {...props}
      ></TertiaryButton>
      <dialog open={open}>
        <div className={classes.dialog}>
          <div>{children}</div>
          <div>
            <form method="dialog">
              <PrimaryButton title={'Close'} onClick={setClosed} />
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}
