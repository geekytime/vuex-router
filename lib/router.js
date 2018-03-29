import findTransition from "./find-transition.js"
import history from "./history.js"
import pageRouter from "./page-router.js"

const state = {
  currentRoute: false,
  lastRoute: false,
  transition: false,
  scrollTops: {},
  location: {
    pathname: "",
    search: "",
    hash: "",
    state: {},
    key: ""
  }
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
  go ({}, {steps}) {  //eslint-disable-line no-empty-pattern
    history.go(steps)
  },
  goBack () {
    history.goBack()
  },
  goForward () {
    history.goForward()
  },
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
  push ({}, {path}) {  //eslint-disable-line no-empty-pattern
    if (path !== history.location.pathname){
      history.push(path)
    }
  },
  replace ({}, {path}) {  //eslint-disable-line no-empty-pattern
    history.replace(path, {replace: true})
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
  setLocation (state, location) {
    state.location = {...location}
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
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
