import "./registerServiceWorker";
import { app } from "./vueapp.js";
import { stateware } from "./store";
import router from "./routes";
import VueLoading from "vue-loading-overlay";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const runApp = async () => {
  app.use(router);
  app.use(VueLoading);
  app.use(VueSweetalert2);
  await new Promise((r) => app.use(stateware, { queryName: "faculty", cb: r }));
  app.mount("#app");
};

runApp().then(() => {});
