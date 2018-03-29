const isPlainLeftClick = (event) => {
  return !(
    (event.button && event.button !== 0)
    || event.metaKey
    || event.altKey
    || event.ctrlKey
    || event.shiftKey
    || event.defaultPrevented === true
  )
}

export default isPlainLeftClick
