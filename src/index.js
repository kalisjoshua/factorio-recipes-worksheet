import {render as preactRender} from "preact"

import App from "./app"

const root = document.getElementById("root")

function render(state) {
  preactRender(<App {...{render, state}} />, root, root.lastChild)
}

if (typeof window !== "undefined") {
  render()
}
