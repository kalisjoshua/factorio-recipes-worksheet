import Editable from "./editable"
import Entry from "./entry"
import Row from "./row"

const template = ({attrs, items, item, remove, update}) => (
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

  const perSecond = out => itemsPerSecond(item, out)

  const items = [...Outputs, ...Inputs].map((i, x, o) => (
    <tr class={`flex-container ${i.type}`}>
      <td>
        <Editable {...{item: o[x], prop: i.type, update: () => update(item)}} />
        <span>&nbsp;</span>
        (<Editable
          {...{item: o[x], prop: "Sum", update: () => update(item)}}
        />)
        <Production
          input={totals.consumption[i.Input]}
          output={totals.production[i.Input]}
        />
      </td>
      <td>{perSecond(i)} / sec</td>
    </tr>
  ))

  return template({attrs, items, item, remove, update})
}

function itemsPerSecond({Time, Speed, Instances}, {Sum}) {
  const scale = 1000
  const temp = Sum / Time * Speed * Instances

  return ~~(temp * scale) / scale
}

function Production({input, output}) {
  const overunder = `production-${input < output
    ? "over"
    : input > output ? "under" : ""}`
  const total = (output || 0) / (input || 1) * 100
  const display = (`${total}`.match(/(\d+(?:\.\d)?)/) || []).shift()

  return <span class={overunder}>Supply {display} %</span>
}

export default instance
export {itemsPerSecond}
