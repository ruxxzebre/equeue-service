/* eslint-disable */
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import createPersistedState from "vuex-persistedstate";
import Root from "../views/Root";
import Admin from "../views/Admin";

const routes = [
  {
    path: '/',
    name: 'Root',
    component: Root,
    beforeEnter: (to, from) => {
      // console.log(to, from);
      return true;
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
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
