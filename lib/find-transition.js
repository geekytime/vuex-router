const findTransition = (oldRoute, newRoute) => {
  const transOut = oldRoute && oldRoute.hasOwnProperty("transIndex")
  const transIn = newRoute && newRoute.hasOwnProperty("transIndex")
  if ( transOut && transIn ){
    const oldIndex = oldRoute.transIndex
    const newIndex = newRoute.transIndex
    if (oldIndex < newIndex){
      return {
        [oldRoute.page]: "slide-out-left",
        [newRoute.page]: "slide-in-left"
      }
    } else if (oldIndex > newIndex) {
      return {
        [oldRoute.page]: "slide-out-right",
        [newRoute.page]: "slide-in-right"
      }
    }
  }
  return false
}

export default findTransition
