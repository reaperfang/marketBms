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
    dashboard
  },
  getters
});
store._apis = api;

export default store
