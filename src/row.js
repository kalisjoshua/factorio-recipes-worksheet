function Row({children, ...rest}) {
  rest.class = `flex-container ${rest.class || ""}`

  return <div {...rest}>{children}</div>
}

export default Row
