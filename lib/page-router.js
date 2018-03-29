import convertPageRoutes from "./convert-page-routes.js"
import UniversalRouter from "universal-router"

var router = new UniversalRouter([{
  path: "*",
  action: () => {}
}])

const init = (pageRoutes) => {
  const routes = convertPageRoutes(pageRoutes)
  router = new UniversalRouter(routes)
}

const resolve = async (location) => {
  try {
    return await router.resolve(location)
  } catch (error) {
    return false
  }
}

export default {
  init,
  resolve
}
