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
    Machine = "",
    Recipe = "",
    Speed = 0,
    Time = 0,
  } = data

  let {
    Inputs = [],
    Outputs = [],
  } = data

  function done() {
    data.Inputs = data.Inputs
      .filter(item => item.Input)
    data.Outputs = data.Outputs
      .filter(item => item.Output)
    create(data)
  }

  function entryRow(text, list, addRow) {
    const result = list
      .filter(item => item[text])

    if (addRow) {
      result.push({ [text]: "", Sum: 1 })
    }

    return result
  }

  function propsUpdate(prop) {
    return value => {
      data[prop] = value
      update(data)
    }
  }

  Inputs = entryRow("Input", Inputs, true)
  Outputs = entryRow("Output", Outputs, true)

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

      {Outputs.map((...args) => lineItem(propsUpdate("Outputs"), ...args))}

      {Inputs.map((...args) => lineItem(propsUpdate("Inputs"), ...args))}

      <Row>
        <Button onClick={done}>Done</Button>
        <Button onClick={cancel} warning>Cancel</Button>
      </Row>
    </section>
  )
}

export default Process
