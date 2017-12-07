function Editable({item, prop, update}) {
  function change(event) {
    item[prop] = event.target.innerText
    update(item)
  }

  function keyPress(event) {
    if (/enter|escape/i.test(event.code)) {
      event.preventDefault()
      event.target.blur()
    }
  }

  return (
    <span contenteditable onBlur={change} onKeydown={keyPress}>
      {item[prop]}
    </span>
  )
}

export default Editable
