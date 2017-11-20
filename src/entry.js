import Field from "./field"

function Entry(props) {
  const {
    isNumber,
    label,
    name,
    onChange,
    value,
  } = props

  const data = Object.keys(props)
    .reduce((acc, key) =>
      (/^data-/.test(key) && (acc[key] = props[key]), acc), {})

  const attrs = {
    ...data,
    id: name,
    min: 0,
    name,
    onChange: (event) => onChange(event.target.value),
    type: isNumber ? "number" : "text",
    value,
  }

  return (
    <Field>
      <label for={name}>{label || name}</label>
      <input {...attrs} />
    </Field>
  )
}

export default Entry
