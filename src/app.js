import "./styles.scss"

import Button from "./button"
import Datalist from "./Datalist"
import Process from "./process"
import Row from "./row"
import Summary from "./summary"

import instance, {itemsPerSecond} from "./instance"

const copy = _ => JSON.parse(JSON.stringify(_))
const startingState = {
  instances: []
}

function App({render, state, store}) {
  state = state || store.get("state") || startingState
  store.put("state", state)

  const addOrEdit = state.pending ? processEntryForm : processAddButton

  function refine([_, indx]) {
    return item => {
      store.batch(item, state.instances[indx])
      state.instances[indx] = item
      render(state)
    }
  }

  function remove([_, indx]) {
    return () => {
      state.instances = state.instances
        .slice(0, indx)
        .concat(state.instances.slice(indx + 1))
      render(state)
    }
  }

  const totals = state.instances.reduce(
    (acc, inst) => {
      inst.Outputs.forEach(o => {
        acc.production[o.Output] =
          (acc.production[o.Output] || 0) + itemsPerSecond(inst, o)
      })
      inst.Inputs.forEach(o => {
        acc.consumption[o.Input] =
          (acc.consumption[o.Input] || 0) + itemsPerSecond(inst, o)
      })

      return acc
    },
    {consumption: {}, production: {}}
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

      <Summary totals={totals} />

      <div class="processes">
        {state.instances.map((...args) =>
          instance(refine(args), remove(args), ...copy(args), totals)
        )}
      </div>

      <Datalist data={Object.keys(store.get("Machine") || {})} id="Machine" />
      <Datalist data={Object.keys(store.get("Recipe") || {})} id="Recipe" />

      {addOrEdit(render, state, store)}
    </main>
  )
}

function processAddButton(render, state, store) {
  function add() {
    state.pending = {}
    render(state)
  }

  return (
    <Row class="button-row">
      <span>
        <Button onClick={add}>Add Process</Button>
      </span>
    </Row>
  )
}

function processEntryForm(render, state, store) {
  const attrs = {
    cancel() {
      delete state.pending
      render(state)
    },
    create(pending) {
      if (processValidator(pending)) {
        store.batch(pending)
        pending.Instances = 1
        state.instances.push(pending)
        delete state.pending
        render(state)
      } else {
        alert("error")
      }
    },
    data: copy(state.pending),
    update(pending) {
      if (state.pending.Machine !== pending.Machine) {
        const found = store.get("Machine")[pending.Machine]

        pending = found ? {...pending, ...found} : pending
      }

      if (state.pending.Recipe !== pending.Recipe) {
        const found = store.get("Recipe")[pending.Recipe]

        pending = found ? {...pending, ...found} : pending
      }

      state.pending = pending
      render(state)
    }
  }

  return <Process {...attrs} />
}

function processValidator(process) {
  const recipe = process.Recipe && process.Time
  const machine = process.Machine && process.Speed
  const items = [...process.Outputs, ...process.Inputs].every(
    field => field[field.type] && field.Sum
  )

  return recipe && machine && items
}

export default App
