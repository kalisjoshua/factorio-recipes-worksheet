import Button from "./button"
import Entry from "./entry"
import Field from "./field"
import Row from "./row"

function lineItem(update, {Input, Output, Sum}, indx, orig) {
  const type = Input !== void 0 ? "Input" : "Output"

  const count = {
    label: "Sum",
    name: `${type}Sum${indx}`,
    onChange: v => update(((orig[indx]["Sum"] = v), orig)),
    value: Sum
  }

  const item = {
    label: type,
    name: `${type}${indx}`,
    onChange: v => update(((orig[indx][type] = v), orig)),
    value: Input || Output
  }

  return (
    <Row class={`table ${type}`}>
      <Entry {...item} />
      <Entry {...count} isNumber />
    </Row>
  )
}

function Process({cancel, create, data, update}) {
  const {
    Inputs = [],
    Machine = "",
    Outputs = [],
    Recipe = "",
    Speed = 0,
    Time = 0,
  } = data

  function entryRow(type, list, addRow) {

    return [
      ...list.filter(item => item[type]),
      { [type]: "", Sum: 1, type: type }
    ]
  }

  function propsUpdate(prop) {
    return value => {
      data[prop] = value
      update(data)
    }
  }

  return (
    <section>
      <h2>New Process</h2>

      <Row>
        <Entry name="Recipe" onChange={propsUpdate("Recipe")} value={Recipe} />

        <Entry isNumber name="Time" onChange={propsUpdate("Time")} value={Time} />
      </Row>

      <Row>
        <Entry name="Machine" onChange={propsUpdate("Machine")} value={Machine} />

        <Entry isNumber name="Speed" onChange={propsUpdate("Speed")} value={Speed} />
      </Row>

      {entryRow("Output", Outputs)
        .map((...args) => lineItem(propsUpdate("Outputs"), ...args))}

      {entryRow("Input", Inputs)
        .map((...args) => lineItem(propsUpdate("Inputs"), ...args))}

      <Row class="button-row">
        <Button onClick={() => create(data)}>Done</Button>
        <Button onClick={cancel} warning>Cancel</Button>
      </Row>
    </section>
  )
}

export default Process
