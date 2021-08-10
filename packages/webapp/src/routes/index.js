import { createRouter, createWebHistory } from 'vue-router';
import { secured } from "@bwi/shared/configs";
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
      const pass = prompt('Пароль: ');
      if (md5(pass) === secured.passwordHash) {
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
