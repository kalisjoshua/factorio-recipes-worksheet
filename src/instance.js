import Entry from "./entry"
import Row from "./row"

function Editable({item, prop, update}) {
  function change(event) {
    item[prop] = event.target.innerText
    update(item)
  }

  function keyPress(event) {
    if (/enter|escape/i.test(event.code)) {
      event.preventDefault()
      event.target.blur()
    }
  }

  return (
    <span contenteditable onBlur={change} onKeydown={keyPress}>
      {item[prop]}
    </span>
  )
}

function instance(update, remove, item, indx, list, totals) {
  const {Inputs, Instances = 1, Outputs} = item

  const attrs = {
    min: 0,
    onChange(event) {
      item.Instances = event.target.value
      update(item)
    },
    type: "number",
    value: Instances
  }

  const lacking = ({Input}) => totals.consumption[Input] > totals.production[Input]

  const perSecond = out => itemsPerSecond(item, out)

  const items = [...Outputs, ...Inputs].map((i, x, o) => (
    <tr class={`flex-container ${i.type}`}>
      <td>
        <Editable {...{item: o[x], prop: i.type, update: () => update(item)}} />
        <span>&nbsp;</span>
        (<Editable {...{item: o[x], prop: "Sum", update: () => update(item)}} />)
        {lacking(i) && <span class="lacking-production">Lacking Production</span>}
      </td>
      <td>{perSecond(i)} / sec</td>
    </tr>
  ))

  // const production =

  return (
    <div class="instance">
      <strong>
        <Editable {...{item, prop: "Recipe", update}} />
      </strong>
      <span>&nbsp;</span>
      (<Editable {...{item, prop: "Time", update}} />)
      <span class="dot remove" onClick={remove} title="Remove Process">
        &times;
      </span>
      <Row>
        <div>
          <Editable {...{item, prop: "Machine", update}} />
          <span>&nbsp;</span>
          (<Editable {...{item, prop: "Speed", update}} />)
        </div>
        <div>
          <input {...attrs} /> <small>Instances</small>
        </div>
      </Row>
      <table>{items}</table>
    </div>
  )
}

function itemsPerSecond({Time, Speed, Instances}, {Sum}) {
  const scale = 1000
  const temp = Sum / Time * Speed * Instances

  return ~~(temp * scale) / scale
}

export default instance
export {itemsPerSecond}
