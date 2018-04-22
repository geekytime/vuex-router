import history from "../lib/modules/history.js"
import test from "tape"
import Vue from "vue"
import Vuex from "vuex"
import wait from "./wait.js"

Vue.use(Vuex)
const createTestStore = () => {
  const store = new Vuex.Store({
    modules: {
      history
    }
  })
  store.dispatch("history/init")
  return store
}

test("history module", async (t) => {
  const store = createTestStore()
  store.dispatch("history/push", {path: "/foo1"})
  t.equals("/foo1", store.state.history.location.pathname, "push")
  store.dispatch("history/push", {path: "/foo2"})
  t.equals("/foo2", store.state.history.location.pathname, "push")
  store.dispatch("history/replace", {path: "/foo3"})
  t.equals("/foo3", store.state.history.location.pathname, "replace navigates")
  store.dispatch("history/goBack")
  await wait()
  t.equals(store.state.history.location.pathname, "/foo1", "replace replaces")
  store.dispatch("history/goForward")
  await wait()
  t.equals("/foo3", store.state.history.location.pathname, "goForward")
  t.end()
})
