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
  state = state || store.get("state") || []
  store.put("state", state)

  const current = state ? state[0] : null

  function refine([_, indx]) {
    return item => {
      store.batch(item, current.Process[indx])
      current.Process[indx] = item
      render(state)
    }
  }

  function remove([_, indx]) {
    return () => {
      current.Process = current.Process
        .slice(0, indx)
        .concat(current.Process.slice(indx + 1))
      render(state)
    }
  }

  const totals =
    current &&
    current.Process.reduce(totalsReduce, {
      consumption: {},
      production: {}
    })

  return (
    <main>
      {/*<h1>Factorio Recipe Worksheet</h1>*/}

      <Complication {...{render, state, store}} />

      {/*<small>Store settings for a multiple map settings.</small>*/}

      {current && current.Process.length ? (
        <Summary totals={totals} />
      ) : (
        <noscript />
      )}

      <div class="processes">
        {current &&
          current.Process.map((...args) =>
            instance(refine(args), remove(args), ...copy(args), totals)
          )}
      </div>

      <Datalist data={store.get("Item") || []} id="Item" />
      <Datalist data={Object.keys(store.get("Machine") || {})} id="Machine" />
      <Datalist data={Object.keys(store.get("Recipe") || {})} id="Recipe" />

      {current &&
        (current.pending ? processEntryForm : processAddButton)(
          render,
          state,
          store
        )}
    </main>
  )
}

function processAddButton(render, state, store) {
  function add() {
    state[0].pending = {}
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
      delete state[0].pending

      render(state)
    },
    create(pending) {
      if (processValidator(pending)) {
        store.batch(pending)
        pending.Instances = 1
        state[0].Process.push(pending)
        delete state[0].pending

        render(state)
      } else {
        alert(
          "You need to fill out some more fields. Josh should write better error handling."
        )
      }
    },
    data: copy(state[0].pending),
    update(pending) {
      if (state[0].pending.Machine !== pending.Machine) {
        const found = store.get("Machine")

        pending = found ? {...pending, ...found[pending.Machine]} : pending
      }

      if (state[0].pending.Recipe !== pending.Recipe) {
        const found = store.get("Recipe")

        pending = found ? {...pending, ...found[pending.Recipe]} : pending
      }

      state[0].pending = pending

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

function totalsReduce(acc, inst) {
  inst.Outputs.forEach(o => {
    acc.production[o.Output] =
      (acc.production[o.Output] || 0) + itemsPerSecond(inst, o)
  })
  inst.Inputs.forEach(o => {
    acc.consumption[o.Input] =
      (acc.consumption[o.Input] || 0) + itemsPerSecond(inst, o)
  })

  return acc
}

export default App
