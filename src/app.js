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

  function cancel() {
    delete state.pending
    render(state)
  }

  function create(pending) {
    if (validate(pending)) {
      state.instances.push(pending)
      delete state.pending
      render(state)
    } else {
      alert("error")
    }
  }

  function update(type, pending) {
    switch (type) {
      case "pending":
        state.pending = pending
        break

      default:
        throw new Error("No update type indicated.")
    }

    render(state)
  }

  const addButton = (
    <Row>
      <Button onClick={add}>Add Process</Button>
    </Row>
  )

  const proc = (
    <Process
      {...{
        cancel,
        create,
        data: state.pending,
        update: a => update("pending", a)
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

      {state.instances.map(instance)}

      {state.pending ? proc : addButton}
    </main>
  )
}

function validate(process) {
  const recipe = process.Recipe && process.Time
  const machine = process.Machine && process.Speed
  const items = [process.Outputs, process.Inputs]
    .every(field =>
      field && field
        .every(({Input, Output, Sum}) =>
          Sum && Input || Output))

  return recipe && machine && items
}

export default App
