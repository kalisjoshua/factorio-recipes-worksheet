import Datalist from "./datalist"
import Editable from "./editable"
import Entry from "./entry"
import Row from "./row"

const name = "Complication"

function Complication({render, state, store}) {
  function add() {
    const found = state
      ? state.filter(item => item[name] === `New ${name}`)[0]
      : void 0

    if (!found) {
      state.unshift({
        Complication: `New ${name}`,
        Process: []
      })

      render(state)
    }
  }

  function choose(key) {
    return () => {
      render([
        ...state.slice(key, key + 1),
        ...state.slice(0, key),
        ...state.slice(key + 1)
      ])
    }
  }

  function remove(key) {
    return () => {
      state = state.filter(item => item[name] !== key)

      render(state)
    }
  }

  function rename(key) {
    return ({Complication: newName}) => {
      state[0][name] = newName

      render(state)
    }
  }

  return (
    <nav class={`${name.toLowerCase()}-tabs`}>
      <ul>
        <li class="clickable" onClick={add} title={`Add a new ${name}`}>
          {!state.length ? `New ${name}` : "+"}
        </li>
        {state.map(({Complication}, indx) => (
          <Tab
            choose={choose(indx)}
            data={store.get(name)}
            isActive={!indx}
            label={Complication}
            remove={remove(Complication)}
            rename={rename(Complication)}
          />
        ))}
      </ul>
    </nav>
  )
}

function Tab({choose, data, isActive, label, remove, rename}) {
  return (
    <li class={`clickable ${isActive ? "isActive" : ""}`} onClick={choose}>
      {isActive ? (
        <Editable item={{...data, [name]: label}} prop={name} update={rename} />
      ) : (
        label
      )}
      <span class="clickable remove" onClick={remove}>
        &times;
      </span>
    </li>
  )
}

export default Complication
