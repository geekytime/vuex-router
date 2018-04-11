/* eslint-disable no-empty-pattern */
import history from "../history.js"

const state = {
  location: {
    pathname: "",
    search: "",
    hash: "",
    state: {},
    key: ""
  }
}

const getters = {

}

const actions = {
  push ({}, {path, transition}) {
    if (path !== history.location.pathname){
      history.push(path, {transition})
    }
  },
  replace ({}, {path, state}) {
    history.replace(path, {...state, replace: true})
  },
  go ({}, {steps}) {
    history.go(steps)
  },
  goBack () {
    history.goBack()
  },
  goForward () {
    history.goForward()
  },
  init ({dispatch}) {
    dispatch("locationChange", history.location)
    history.listen((location) => {
      dispatch("locationChange", location)
    })
  },
  locationChange: async ({commit, dispatch}, payload) => {
    commit("setLocation", payload)
    dispatch("locationChange", payload, {root: true})
  }
}

const mutations = {
  setLocation (state, location) {
    state.location = {...location}
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
