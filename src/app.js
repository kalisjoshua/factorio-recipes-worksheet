import "./styles.scss"

import Button from "./button"
import Entry from "./entry"
import Process from "./process"
import Row from "./row"

import instance from "./instance"

const startingState = {
  instances: []
}

function App({render, state = startingState}) {
  function add() {
    state.pending = {}
    render(state)
  }

  function refine(indx, item) {
    state.instances[indx] = item
    render(state)
  }

  function remove(indx) {
    state.instances = state.instances
      .slice(0, indx)
      .concat(state.instances.slice(indx + 1))
    render(state)
  }

  const addButton = (
    <Row class="button-row">
      <span><Button onClick={add}>Add Process</Button></span>
    </Row>
  )

  const proc = (
    <Process
      {...{
        cancel() {
          delete state.pending
          render(state)
        },
        create(pending) {
          if (validate(pending)) {
            pending.Instances = 1
            state.instances.push(pending)
            delete state.pending
            render(state)
          } else {
            alert("error")
          }
        },
        data: state.pending,
        update(pending) {
          state.pending = pending
          render(state)
        },
      }}
    />
  )

  return (
    <main>
      <h1>Factorio Recipe Worksheet</h1>

      {/*
      <Row>
        <Entry name="Map Settings" />
      </Row>

      <small>Store settings for a multiple map settings is localStorage.</small>
      */}

      <div class="processes">
        {state.instances.map((...args) =>
          instance(v => refine(args[1], v), () => remove(args[1]), ...args))}
      </div>

      {state.pending ? proc : addButton}
    </main>
  )
}

function validate(process) {
  console.log(process)
  const recipe = process.Recipe && process.Time
  const machine = process.Machine && process.Speed
  const items = [process.Outputs, process.Inputs]
    .every(field =>
      field && field
        .every(({Input, Output, Sum}) =>
          Sum && Input || Output))

  console.log({recipe, machine, items})
  return recipe && machine && items
}

export default App
