import Datalist from "./datalist"
import Entry from "./entry"
import Row from "./row"

const name = "Complication"

function Complication({render, state, store}) {
  const editing = {
    list: name,
    name,
    onChange: change,
    value: state[name]
  }

  const jump = {
    list: name,
    name: "Jump",
    onChange() {},
    onInput(event) {
      change(event.target.value)
    },
    value: ""
  }

  function change(value) {
    state[name] = value

    const found = store.get(name)

    if (found && found[value]) {
      state.instances = found[value]
    } else {
      state.instances = []
    }

    render(state)
  }

  return (
    <Row>
      <Datalist data={Object.keys(store.get(name) || {})} id={name} />
      <Entry {...editing} tabindex="1" />
      <Entry {...jump} tabindex="-1" />
    </Row>
  )
}

export default Complication
