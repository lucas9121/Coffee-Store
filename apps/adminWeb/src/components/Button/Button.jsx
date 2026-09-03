import styles from "./Button.module.css"
function Button({
  variant = "primary",
  size = "md",
  isDisabled = false,
  children,
  ...otherProps
}){
  return(
    <button
      type="button"
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      disabled = {isDisabled}
      {...otherProps}
    >{children}</button>
  )
};

export default Button;