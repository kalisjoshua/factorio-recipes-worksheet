import "./styles.scss"

import Button from "./button"
import Complication from "./complication"
import Datalist from "./datalist"
import Process from "./process"
import Row from "./row"
import Summary from "./summary"

import instance, {itemsPerSecond} from "./instance"

const copy = _ => JSON.parse(JSON.stringify(_))

function App({render, state, store}) {
  state = state || store.get("state") || {}

  if (!state.instances) {
    state.instances = []
  }

  store.put("state", state)

  if (state.Complication) {
    const allComplications = store.get("Complication") || {}

    allComplications[state.Complication || ""] = state.instances
    store.put("Complication", allComplications)
  }

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
      <h1>
        {state.Complication ? state.Complication : "Factorio Recipe Worksheet"}
      </h1>

      <Complication {...{render, state, store}} />

      {/*
      <small>Store settings for a multiple map settings is localStorage.</small>
      */}

      {state.instances.length ? <Summary totals={totals} /> : <noscript />}

      <div class="processes">
        {state.instances.map((...args) =>
          instance(refine(args), remove(args), ...copy(args), totals)
        )}
      </div>

      <Datalist data={store.get("Item") || []} id="Item" />
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
      <Button onClick={add} tabindex="2">
        Add Process
      </Button>
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
        alert(
          "You need to fill out some more fields. Josh should write better error handling."
        )
      }
    },
    data: copy(state.pending),
    update(pending) {
      if (state.pending.Machine !== pending.Machine) {
        const found = store.get("Machine")

        pending = found ? {...pending, ...found[pending.Machine]} : pending
      }

      if (state.pending.Recipe !== pending.Recipe) {
        const found = store.get("Recipe")

        pending = found ? {...pending, ...found[pending.Recipe]} : pending
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
