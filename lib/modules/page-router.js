import findTransition from "../find-transition.js"
import history from "../history.js"
import historyModule from "./history.js"
import pageRouter from "../page-router.js"

const state = {
  currentRoute: false,
  lastRoute: false,
  transition: false,
  scrollTops: {},
}

const getters = {
  currentPage (state) {
    if (state.currentRoute){
      return state.currentRoute.page || false
    }
    return false
  },
  lastPage (state) {
    if (state.lastRoute){
      return state.lastRoute.page || false
    }
    return false
  },
  scrollTopForPage: (state) => (page) => {
    return state.scrollTops[page] || 0
  },
  transitionForPage: (state) => (page) => {
    if (state.transition){
      return state.transition[page] || false
    }
    return false
  }
}

const actions = {
  init ({dispatch}, {pageRoutes} = {}) {
    if (pageRoutes) {
      pageRouter.init(pageRoutes)
    }
    dispatch("locationChange", history.location)
    history.listen((location) => {
      dispatch("locationChange", location)
    })
  },
  locationChange: async ({commit, state}, payload) => {
    commit("setLocation", payload)
    const location = `${payload.pathname}${payload.search}${payload.hash}`
    const route = await pageRouter.resolve(location)
    if (route) {
      if (payload.state && payload.state.replace){
        commit("replaceRoute", {route})
      } else {
        const transition = findTransition(state.currentRoute, route)
        commit("showRoute", {route, transition})
      }
    } else {
      commit("showRoute", {route: {page: "four-zero-four"}})
    }
  },
  transitionEnd ({commit}) {
    commit("transitionEnd")
  }
}

const mutations = {
  replaceRoute (state, {route}) {
    state.currentRoute = route
  },
  saveScrollTop (state, {name, scrollTop}){
    const newKey = {[name]: scrollTop}
    state.scrollTops = {...state.scrollTops, ...newKey}
  },
  showRoute (state, {route, transition}) {
    state.lastRoute = state.currentRoute
    state.currentRoute = route
    state.transition = transition || false
  },
  transitionEnd(state) {
    state.transition = false
  }
}

export default {
  state: {...historyModule.state, ...state},
  getters: {...historyModule.getters, ...getters},
  actions: {...historyModule.actions, ...actions},
  mutations: {...historyModule.mutations, ...mutations},
  namespaced: true
}
