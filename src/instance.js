import Entry from "./entry"
import Row from "./row"

function Editable({item, prop, update}) {
  function change(event) {
    item[prop] = event.target.innerText
    update(item)
  }

  return (
    <span contenteditable onBlur={change}>{item[prop]}</span>
  )
}

function instance(update, remove, item) {
  const {Inputs, Instances, Outputs, Speed, Time} = item

  const attrs = {
    min: 0,
    onChange(event) {
      item.Instances = event.target.value
      update(item)
    },
    type: "number",
    value: Instances || 1,
  }
  
  const items = [...Outputs, ...Inputs]
    .map((i, x, o) => (
      <tr class={`flex-container ${i.type}`}>
        <td>
          <Editable {...{item: o[x], prop: i.type, update: () => update(item)}} />
          <span>&nbsp;</span>
          (<Editable {...{item: o[x], prop: "Sum", update: () => update(item)}} />)
            </td>
        <td>{i.Sum / Time * Speed * (Instances || 1)} / sec</td>
      </tr>
    ))

  return (
    <div class="instance">
      <strong>
        <Editable {...{item, prop: "Recipe", update}} />
      </strong>
      <span>&nbsp;</span>
      (<Editable {...{item, prop: "Time", update}} />)
      <span class="dot remove" onClick={remove} title="Remove Process">&times;</span>
      <Row>
        <div>
          <Editable {...{item, prop: "Machine", update}} />
          <span>&nbsp;</span>
          (<Editable {...{item, prop: "Speed", update}} />)
        </div>
        <div><input {...attrs} /> <small>Instances</small></div>
      </Row>
      <table>
        {items}
      </table>
    </div>
  )
}

export default instance
