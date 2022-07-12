import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'guanliTOKEN'
})
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null
  },
  getters: {
  },
  mutations: {
    setToken (state, payload) {
      state.token = payload
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
