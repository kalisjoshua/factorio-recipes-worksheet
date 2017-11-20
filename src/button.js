function Button(props) {
  const {children} = props

  delete props.children

  return (
    <span button {...props}>{children}</span>
  )
}

export default Button
