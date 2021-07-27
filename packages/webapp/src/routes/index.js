/* eslint-disable */
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/:stateType',
    name: 'Root',
    component: "",
  },
  {
    path: '/admin',
    name: 'Admin',
    component: ""
  },
  {
    path: '/about',
    name: 'About',
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
