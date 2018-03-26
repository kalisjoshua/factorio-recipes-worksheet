function calculate({consumption, production}) {
  const accumulator = {input: [], output: [], surplus: []}
  const keys = [...Object.keys(consumption), ...Object.keys(production)]

  function reduceTotals(acc, key) {
    const input = !(key in production)
    const output = (production[key] || 0) - (consumption[key] || 0)

    if (output > 0) {
      if (!(key in consumption)) {
        acc.output.push({
          output: key,
          sum: output,
          type: "output"
        })
      } else {
        acc.surplus.push({
          surplus: key,
          sum: output,
          type: "surplus"
        })
      }
    }

    if (input) {
      acc.input.push({
        input: key,
        sum: consumption[key],
        type: "input"
      })
    }

    return acc
  }

  return Array.from(new Set(keys)).reduce(reduceTotals, accumulator)
}

function Display({data, children}) {
  return (
    <dl class={`${children}`.toLowerCase()}>
      <dt>{children}</dt>
      {data.map(item => (
        <dd class="flex-container">
          <span>{item[item.type]}</span>{" "}
          <span style="text-align: right; white-space: nowrap;">
            ({~~(item.sum * 100) / 100} / sec)
          </span>
        </dd>
      ))}
    </dl>
  )
}

function Summary({totals}) {
  const {input, output, surplus} = calculate(totals)

  return (
    <section class="summary">
      <Display data={output}>Output</Display>
      <Display data={input}>Input</Display>
      <Display data={surplus}>Surplus</Display>
    </section>
  )
}

export default Summary
