import { createRouter, createWebHistory } from 'vue-router';
import md5 from "md5";
import Root from "../views/Root";
import Admin from "../views/Admin";
import About from "../views/About";

const routes = [
  {
    path: '/',
    name: 'Root',
    component: Root,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: () => {
      const pass = prompt('password: ');
      if (md5(pass) === '897a779351421523cadbafccdce22efe') {
        return true;
      }
      return { path: "/" };
    },
  },
  {
    path: '/about',
    name: 'About',
    beforeEnter: () => {  },
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
