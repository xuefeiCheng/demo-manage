import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import ChinaMap from './modules/ChinaMap'
import chinaMap2 from './modules/chinaMap2'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    ChinaMap,
    chinaMap2
  },
  getters
})

export default store
