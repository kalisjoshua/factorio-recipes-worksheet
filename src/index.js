import {render as preactRender} from "preact"

import App from "./app"
import newStore from "./storage"

const store = newStore("2017-11-20")
const root = document.getElementById("root")

if (root && typeof window !== "undefined") {
  function render(state) {
    preactRender(<App {...{store, render, state}} />, root, root.lastChild)
  }

  render()
}
