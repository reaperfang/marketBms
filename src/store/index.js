import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import menu from './modules/menu'
import set from './modules/set'
import decorate from './modules/decorate'
import data from './modules/data'
import shop from './modules/shop'
import client from './modules/client'
import order from './modules/order'
import getters from './getters'
import api from '@/api';
import dashboard from "./modules/dashboard";
import datashop from "./modules/datashop";

import createLogger from "@/plugins/logger";
import createPersistedState from "vuex-persistedstate";
const debug = process.env.NODE_ENV !== "prod";

const vuexPersisted = new createPersistedState({
  key: "myVuex",
  storage: window.localStorage,
  reducer: state => ({
    dashboard: {
      // realtimeuser: state.dashboard.realtimeuser,
      highlight:state.dashboard.highlight
    }
  })
});

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    tagsView,
    user,
    menu,
    set,
    decorate,
    data,
    shop,
    client,
    order,
    dashboard,
    datashop
  },
  getters,
  strict: debug,
  plugins: process.env.NODE_ENV === '' ? [createLogger(), vuexPersisted] : [vuexPersisted]

});
store._apis = api;

export default store
