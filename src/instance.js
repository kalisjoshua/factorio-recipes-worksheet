import Entry from "./entry"
import Row from "./row"

function Editable() {

  return (
    <span contenteditable></span>
  )
}

function instance(update, remove, item) {
  const {Inputs, Instances, Machine, Outputs, Recipe, Speed, Time} = item
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

  return (
    <li class="instance">
      <strong><span contenteditable>{Recipe}</span><span class="dot remove" onClick={remove} title="Remove Process">&times;</span></strong>
      <Row>
        <div>
          <span contenteditable>{Machine}</span>
          <span>&nbsp;</span>
          (<span contenteditable>{Speed}</span>)
        </div>
        <div><input {...attrs} /> Instances</div>
      </Row>
      <table>
        {items.map(i => (
          <tr class={`flex-container ${i.type}`}>
            <td>{i.Input || i.Output}</td>
            <td>{i.Sum / Time * Speed * (Instances || 1)} / sec</td>
          </tr>
        ))}
      </table>
    </li>
  )
}

export default instance
