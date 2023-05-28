import {createStore } from 'vuex'

const store = createStore({
  state () {
    return {
      count: 0,
      transaction: null,
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setTransaction(state, transactionPayload) {
        state.transaction = transactionPayload;
    }
  },
  actions: {
    fetchTraction({ commit }, { id }) {
        commit("setTransaction", id)
    }
  }
})

export default store;