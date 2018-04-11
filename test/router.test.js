import createTestStore from "./create-test-store.js"
import pageRoutes from "./page-routes.js"
import test from "tape"
import wait from "./wait.js"

test("router", async (t) => {
  const store = createTestStore()
  store.dispatch("router/init", {pageRoutes})
  await wait()
  t.equals(store.getters["router/currentPage"], "home", "default route is initialized")

  store.dispatch("router/push", {path: "/foo#some-id"})
  await wait()
  t.equals(store.getters["router/currentPage"], "foo", "page updated when route changes")
  t.equals(store.state.router.location.hash, "#some-id")

  store.dispatch("router/replace", {path:"/bar/baz?someProp=someValue"})
  await wait()
  t.equals(store.state.router.currentRoute.page, "bar", "route params get right page")
  t.equals(store.state.router.currentRoute.params.id, "baz", "route params get right params")
  t.equals(store.state.router.location.search, "?someProp=someValue")

  store.dispatch("router/go", {steps: -1})
  await wait()
  t.equals(store.getters["router/currentPage"], "home", "skips back over replaced items")

  store.dispatch("router/goForward")
  await wait()
  t.equals(store.state.router.currentRoute.page, "bar", "skips forward to right page")
  t.equals(store.state.router.currentRoute.params.id, "baz", "skips forward to right params")

  store.dispatch("router/goBack")
  await wait()
  t.equals(store.state.router.currentRoute.page, "home", "goes back to expected page")

  store.dispatch("router/push", {path: "/wrong"})
  await wait()
  t.equals(store.getters["router/currentPage"], "four-zero-four", "goes to fourZeroFour on unknown routes")

  t.end()
})
