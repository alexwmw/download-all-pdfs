import classes from './Buttons.module.less'
import clsx from 'clsx'
import React, { useState } from 'react'

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
        fullWidth && classes.fullWidth,
        isDialogButton && classes.dialogButton
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

export const DialogButton = ({ title, ...props }) => {
  const [showDialog, setShowDialog] = useState(false)
  return (
    <TertiaryButton
      title={title}
      onClick={() => {
        setShowDialog(!showDialog)
      }}
      isDialogButton={true}
      {...props}
    >
      <dialog open={showDialog}>
        <PrimaryButton
          onClick={() => setShowDialog(!showDialog)}
          title={'Close'}
        />
      </dialog>
    </TertiaryButton>
  )
}
