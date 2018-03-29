import test from "tape"
import Link from "../lib/link.vue"
import mount from "./mount.js"
import wait from "./wait.js"

test("Link - basic", async (t) => {
  const {store, wrapper} = mount(Link, {
    propsData: { to: "/foo" },
    slots: {
      default: "<div>foo</div>"
    }
  })
  t.equals(wrapper.html(), `<a href="/foo"><div>foo</div></a>`)
  const beforeClick = "" + store.state.router.location.pathname
  wrapper.find("a").trigger("click")
  t.equals(store.state.router.location.pathname, "/foo")
  store.dispatch("router/goBack")
  await wait()
  t.equals(store.state.router.location.pathname, beforeClick)
  t.end()
})

test("Link - replace", async (t) => {
  const {store, wrapper} = mount(Link, {
    propsData: {
      replace: true,
      to: "/replaced"
    },
    slots: {
      default: "<div>replaced</div>"
    }
  })

  store.dispatch("router/push", {path: "/"})
  await wait()
  store.dispatch("router/push", {path: "/foo"})
  await wait()
  wrapper.find("a").trigger("click")
  t.equals(store.state.router.location.pathname, "/replaced")

  store.dispatch("router/goBack")
  await wait()

  t.equals(store.state.router.location.pathname, "/")
  t.end()
})
