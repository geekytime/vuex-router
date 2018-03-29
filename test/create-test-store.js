import Vuex from "vuex"
import {router} from "../lib/index.js"

const createTestStore = () => {
  return new Vuex.Store({
    modules: {
      router
    }
  })
}

export default createTestStore
