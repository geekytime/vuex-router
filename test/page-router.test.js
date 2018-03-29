import pageRouter from "../lib/page-router.js"
import pageRoutes from "./page-routes.js"
import test from "tape"

test("pageRouter", async (t) => {
  t.notOk(await pageRouter.resolve("/foobar"))
  pageRouter.init(pageRoutes)

  const homeRoute = await pageRouter.resolve({pathname: "/"})
  t.equals(homeRoute.page, "home")
  t.equals(homeRoute.transIndex, 0)

  const barRoute = await pageRouter.resolve({pathname: "/bar"})
  t.equals(barRoute.page, "bar")
  t.equals(barRoute.transIndex, 2)

  t.end()
})
