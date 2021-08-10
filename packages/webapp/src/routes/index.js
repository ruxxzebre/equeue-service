import { createRouter, createWebHistory } from 'vue-router';
import Root from "../views/Root";

const routes = [
  {
    path: '/',
    name: 'Root',
    component: Root,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "about" */ '../views/Admin.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: {
      template: "<h1>Have a good day</h1>"
    }
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
