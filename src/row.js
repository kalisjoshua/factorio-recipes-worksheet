function Row({children, ...rest}) {

  return (
    <div {...rest} flex-container>{children}</div>
  )
}

export default Row
