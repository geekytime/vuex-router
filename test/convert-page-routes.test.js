import convertPageRoutes from "../lib/convert-page-routes.js"
import pageRoutes from "./page-routes.js"
import test from "tape"

test("convertRoutes", (t) => {
  const routes = convertPageRoutes(pageRoutes)
  t.equals(routes.length, 3)

  t.equals(routes[0].path, "/")
  t.equals(routes[0].page, "home")
  t.equals(routes[0].transIndex, 0)

  t.equals(routes[1].path, "/foo")
  t.equals(routes[1].page, "foo")
  t.equals(routes[1].transIndex, 1)

  t.deepEquals(routes[2].path, ["/bar", "/bar/:id"])
  t.equals(routes[2].page, "bar")
  t.equals(routes[2].transIndex, 2)

  t.end()
})
