import Field from "./field"

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
    <Field>
      <label for={name}>{label || name}</label>
      <input {...attrs} />
    </Field>
  )
}

export default Entry
