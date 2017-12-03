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

  // const lacking = ({Input}) => {
  //   const total = (totals.production[Input] || 0) / (totals.consumption[Input] || 1) * 100

  //   console.log(`${total}`.match(/(\d+(?:\.\d)?)/)[1])
  //   return `${total}` + `${total}`.match(/(\d+(?:\.\d)?)/)
  // }

  const perSecond = out => itemsPerSecond(item, out)

  const items = [...Outputs, ...Inputs].map((i, x, o) => (
    <tr class={`flex-container ${i.type}`}>
      <td>
        <Editable {...{item: o[x], prop: i.type, update: () => update(item)}} />
        <span>&nbsp;</span>
        (<Editable {...{item: o[x], prop: "Sum", update: () => update(item)}} />)
        <Production input={totals.consumption[i.Input]} output={totals.production[i.Input]} />
        {/*lacking(i) < 100 && <span class="lacking-production">Satisfaction {lacking(i)}%</span>*/}
      </td>
      <td>{perSecond(i)} / sec</td>
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

function itemsPerSecond({Time, Speed, Instances}, {Sum}) {
  const scale = 1000
  const temp = Sum / Time * Speed * Instances

  return ~~(temp * scale) / scale
}

function Production({input, output}) {
  const overunder = `production-${input < output ? "over" : input > output ? "under" : ""}`
  const total = (output || 0) / (input || 1) * 100
  const display = (`${total}`.match(/(\d+(?:\.\d)?)/) || []).shift()

  return <span class={overunder}>Supply {display} %</span>
}

export default instance
export {itemsPerSecond}
