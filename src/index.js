import {render as preactRender} from "preact"

import App from "./app"
import newStore from "./storage"

const store = newStore("2017-11-20")
let root

function render(state) {
  preactRender(<App {...{store, render, state}} />, root, root.lastChild)
}

if (typeof window !== "undefined") {
  root = document.createElement("DIV")
  document.body.appendChild(root)
  render()
}
