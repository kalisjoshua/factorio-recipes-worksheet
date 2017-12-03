function Entry(props) {
  const {isNumber, label, list, name, value} = props

  const data = Object.keys(props).reduce(
    (acc, key) => (/^data-/.test(key) && (acc[key] = props[key]), acc),
    {}
  )

  const change = event => props.onChange(event.target.value)

  const attrs = {
    ...data,
    id: name,
    list,
    name,
    onBlur: change,
    onChange: change,
    onInput: props.onInput || (() => {}),
    tabindex: props.tabindex || 0,
    value
  }

  if (isNumber) {
    attrs.min = 0
    attrs.type = "number"
  }

  return (
    <span field>
      <label for={name}>{label || name}</label>
      <input {...attrs} />
    </span>
  )
}

export default Entry
