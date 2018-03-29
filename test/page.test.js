import mount from "./mount.js"
import Page from "../lib/page.vue"
import test from "tape"
import wait from "./wait.js"

const App = {
  components: {
    Page
  },
  template: `
    <Page name="home">
      <h1>Homepage</h1>
    </Page>
  `
}

test("Page show/hide, scrollTop", async (t) => {
  const {store, wrapper} = mount(App)

  store.dispatch("router/push", {path: "/"})
  await wait()

  t.ok(wrapper.is("div"), "shows when path matches")
  t.ok(wrapper.classes().includes("page-wrapper"), "has the expected class")
  t.ok(wrapper.contains("h1"), "contains the slotted content")

  store.dispatch("router/push", {path: "/foo"})
  await wait()

  t.equals(wrapper.html(), undefined, "hides when path doesn't match")
  t.equals(store.state.router.scrollTops.home, 0)

  store.dispatch("router/push", {path: "/"})
  await wait()

  t.ok(wrapper.is("div"), "shows when path matches again")

  t.end()
})
