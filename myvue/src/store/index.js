import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    breads: [],
    user: sessionStorage.getItem('v-user') ? JSON.parse(sessionStorage.getItem('v-user')) : {}
  },
  mutations: {
    addBread (state, bread) {
      const index = state.breads.findIndex(_bread => _bread.name === bread.name)
      if (index > -1) {
        state.breads.splice(index + 1, state.breads.length - index - 1)
      } else {
        state.breads.push(bread)
      }
    },
    removeBread (state, bread) {
      state.breads = state.breads.filter(_bread => _bread !== bread)
    },
    setUser (state, user) {
      // 比如霸道总裁进来了 霸道总裁的数据都在user里面是这个意思
      state.user = user
      console.log(state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
