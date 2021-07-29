/* eslint-disable */
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import createPersistedState from "vuex-persistedstate";
import Root from "../views/Root";
import Admin from "../views/Admin";
import {API} from "../helpers/api";

const routes = [
  {
    path: '/',
    name: 'Root',
    component: Root,
    beforeEnter: (to, from) => {
      console.log(to.query);
      if (to.query.adm) {
        return { path: '/adm' };
      }
      // console.log(to, from);
      return true;
    },
  },
  {
    path: '/adm',
    name: 'Admin',
    component: Admin,
    beforeEnter: () => {
      const pass = prompt('password: ');
      if (pass === 'flex') {
        return true;
      }
      return { path: "/" };
    },
  },
  {
    path: '/about',
    name: 'About',
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  plugins: [createPersistedState()],
  routes,
});

export default router;