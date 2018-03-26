import Editable from "./editable"
import Row from "./row"

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

  const throughput = Inputs.reduce((acc, {Input}) => {
    return Math.min(
      totals.production[Input] / totals.consumption[Input] || 2,
      acc
    )
  }, 1)

  const items = [...Outputs, ...Inputs].map((i, x, o) => (
    <tr class={`flex-container ${i.type}`}>
      <td>
        <Editable {...{item: o[x], prop: i.type, update: () => update(item)}} />
        <span>&nbsp;</span>
        (<Editable
          {...{item: o[x], prop: "Sum", update: () => update(item)}}
        />)
        <Production
          input={totals.consumption[i[i.type]]}
          output={totals.production[i[i.type]]}
        />
      </td>
      <td>{itemsPerSecond(item, i, throughput)} / sec</td>
    </tr>
  ))

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

function itemsPerSecond({Instances, Speed, Time}, {Sum}, throughput = 1) {
  return +`${Sum / Time * Speed * Instances * throughput}`.match(
    /(\d+(?:\.\d{0,2})?)/
  )[1]
}

function Production({input, output}) {
  const overunder = `production-${
    input < output ? "over" : input > output ? "under" : ""
  }`
  const total = (output || 0) / (input || 1) * 100
  const display = (`${total}`.match(/(\d+(?:\.\d)?)/) || []).shift()

  return <span class={overunder}>{display} %</span>
}

export default instance
export {itemsPerSecond}
