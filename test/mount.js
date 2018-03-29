import "regenerator-runtime/runtime"
import createTestStore from "./create-test-store.js"
import { mount , createLocalVue } from "@vue/test-utils"
import pageRoutes from "./page-routes.js"
import Vuex from "vuex"

const mountComponent = (Component, options) => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  const store = createTestStore()
  store.dispatch("router/init", {pageRoutes})

  const settings = {...options, ...{store, localVue}}
  const wrapper = mount(Component, settings)

  return {
    store,
    wrapper
  }
}

export default mountComponent
