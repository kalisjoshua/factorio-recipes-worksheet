const copy = _ => JSON.parse(JSON.stringify(_))
const typeOf = Function.call.bind(({}).toString)

function factory(version) {
  const cache = {}
  const token = key => `${version}-${key}`

  const del = key =>
    localStorage.removeItem(token(key))
  const get = key =>
    JSON.parse(localStorage.getItem(token(key)))
  const put = (key, val) =>
    localStorage.setItem(token(key), JSON.stringify(val))

  const lib = { add, batch, del, get, put }

  function add(key, val) {
    switch (typeOf(val)) {
      case "[object Array]":
        put(key, [...(new Set([...(get(key) || []), ...val]).values())])
        break

      case "[object Object]":
        put(key, (temp => (temp[val[key]] = val, temp))(get(key) || {}))
        break

      default:
        throw new Error(`Unexpected value type: ${typeOf(val)}.`)
        break
    }
  }

  function batch(current, previous) {
    if (previous) {
      const Items = items(previous)
      const { Machine, Speed } = previous

      delete previous.Machine
      delete previous.Speed

      put("Item", get("Item").filter(i => !Items.includes(i)))
      put("Machine", (temp => (delete temp[Machine], temp))(get("Machine") || {}))
      put("Recipe", (temp => (delete temp[previous.Recipe], temp))(get("Recipe") || {}))
    }

    const Recipe = copy(current)
    const { Machine, Speed } = Recipe

    delete Recipe.Machine
    delete Recipe.Speed

    add("Item", items(Recipe))
    add("Machine", { Machine, Speed })
    add("Recipe", Recipe)
  }

  function items({ Inputs, Outputs }) {

    return [...Inputs, ...Outputs]
      .map(item => item[item.type])
  }

  return lib
}

export default factory

/*

console.clear()
let expected

const cache = factory("2017-11-24")

if (typeOf(factory) !== "[object Function]") {
  console.log(typeOf(factory))
  throw new Error("Not an function.")
}

if (typeOf(cache) !== "[object Object]") {
  console.log(typeOf(cache))
  throw new Error("Not an object.")
}

cache.put("Hello", "World")
if (cache.get("Hello") !== "World") {
  console.log(cache.get("Hello"))
  throw new Error("Can not get stored value")
}

cache.del("Hello")
if (cache.get("Hello")) {
  console.log(cache.get("Hello"))
  throw new Error("Unable to remove items")
}

cache.put("myArray", [1, 2, 3])
cache.add("myArray", [4, 5, 6])
if (cache.get("myArray").join() !== [1, 2, 3, 4, 5, 6].join()) {
  console.log(cache.get("myArray"))
  throw new Error("Appending to values not working")
}
cache.del("myArray")

const mock = {
  Recipe: "Ceramic Slurry Filtering",
  Time: 2,
  Machine: "Filtration Unit Mk1",
  Speed: 1,
  Outputs: [
    { Output: "Slag", Sum: 1, type: "Output" },
    { Output: "Oxygen", Sum: 40, type: "Output" },
    { Output: "Hydrogen", Sum: 60, type: "Output" },
  ],
  Inputs: [
    { Input: "Water", Sum: 100, type: "Input" },
  ],
}

cache.del("Item")
cache.del("Machine")
cache.del("Recipe")
cache.batch(mock)
expected = copy({ [mock.Machine]: { Machine: mock.Machine, Speed: mock.Speed } })
if (JSON.stringify(cache.get("Machine")) !== JSON.stringify(expected)) {
  console.log(cache.get("Machine"))
  throw new Error("Not getting the Machine")
}
expected = copy(mock)
delete expected.Machine
delete expected.Speed
if (JSON.stringify(cache.get("Recipe")[mock.Recipe]) !== JSON.stringify(expected)) {
  console.log(cache.get("Recipe"))
  throw new Error("Not getting the Recipe")
}
if (cache.get("Item").join() !== ["Water", "Slag", "Oxygen", "Hydrogen"].join()) {
  console.log(cache.get("Item"))
  throw new Error("Items are not as expected")
}

const erroredInput = copy(mock)
erroredInput.Outputs[0].Output = "abcdef"
erroredInput.Machine = "Not a machine at all"
erroredInput.Recipe = "Sluggy sluffy"
cache.del("Item")
cache.del("Machine")
cache.del("Recipe")
cache.batch(erroredInput)
cache.batch(mock, erroredInput)
if (cache.get("Item").join() !== ["Water", "Slag", "Oxygen", "Hydrogen"].join()) {
  console.log(cache.get("Item"))
  throw new Error("Batch update not working for Items")
}
expected = { [mock.Machine]: { Machine: mock.Machine, Speed: mock.Speed } }
if (JSON.stringify(cache.get("Machine")) !== JSON.stringify(expected)) {
  console.log(expected)
  throw new Error("Batch update not working for Machine")
}
expected = copy(mock)
delete expected.Machine
delete expected.Speed
if (JSON.stringify(cache.get("Recipe")[mock.Recipe]) !== JSON.stringify(expected)) {
  console.log(cache.get("Recipe"))
  throw new Error("Batch update not working for Recipe")
}
*/