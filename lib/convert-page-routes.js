export default (pageRoutes) => {
  return pageRoutes.map((pageRoute) => {
    const action = (context) => {
      return {
        page: pageRoute.page,
        params: context.params,
        transIndex: pageRoute.transIndex
      }
    }
    return {...pageRoute, ...{action}}
  })
}
