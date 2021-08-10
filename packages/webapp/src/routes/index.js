import { createRouter, createWebHistory } from "vue-router";
// import { secured } from "@bwi/shared/configs";
// import md5 from "md5";
import Root from "../views/Root";
import Admin from "../views/Admin";
import About from "../views/About";
import { API } from "../helpers/api";

const routes = [
  {
    path: "/",
    name: "Root",
    component: Root,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/about",
    name: "About",
    beforeEnter: () => {},
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const protectedPages = ["/admin"];

/**
 *
 * @param {RouteLocationNormalized} to
 * @return {boolean}
 */
export const isPageProtected = (to) => {
  return !!protectedPages.find((page) =>
    to.matched.find((i) => i.path.includes(page))
  );
};

router.beforeEach(async (to, from, next) => {
  // TODO: fix not holding session
  const isAuthenticated = (await API.get("/auth/valid")).data.authenticated;
  if (isPageProtected(to) && !isAuthenticated) {
    const username = await prompt("Логін: ");
    const password = await prompt("Пароль: ");
    const authed = await API.post("/auth/login", { username, password })
      .then(() => true)
      .catch(() => null);
    console.log(authed);
    if (!authed) return next("/");
    return next();
  }
  return next();
});

export default router;
