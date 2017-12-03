function Button(props) {
  const {children} = props

  delete props.children

  return <button {...props}>{children}</button>
}

export default Button
