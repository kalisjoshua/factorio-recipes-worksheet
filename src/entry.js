function Entry(props) {
  const {isNumber, label, list, name, onChange, value} = props

  const data = Object.keys(props).reduce(
    (acc, key) => (/^data-/.test(key) && (acc[key] = props[key]), acc),
    {}
  )

  const attrs = {
    ...data,
    id: name,
    list,
    name,
    onChange: event => onChange(event.target.value),
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
