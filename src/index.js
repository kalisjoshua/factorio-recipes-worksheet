import {render as preactRender} from "preact"

import App from "./app"

const root = document.getElementById("root")

function render(state) {
  preactRender(<App {...{render, state}} />, root, root.lastChild)
}

if (typeof window !== "undefined") {
  if (false) {
    render()
  } else {
    const dirtWater = {
      Machine: "Electrolyzer Mk2",
      Recipe: "Dirt Water Electrolysis",
      Speed: 1.5,
      Time: 2,
      Outputs: [
        {
          Output: "Slag",
          Sum: 1,
          type: "Output",
        },
        {
          Output: "Oxygen",
          Sum: 30,
          type: "Output",
        },
        {
          Output: "Hydrogen",
          Sum: 40,
          type: "Output",
        }
      ],
      Inputs: [
        {
          Input: "Water",
          Sum: 100,
          type: "Input",
        }
      ],
    }

    render({
      instances: [
        dirtWater,
      ]
    })
  }
}
