import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import "./registerServiceWorker";
import { app } from "./vueapp.js";
import store from "./store/vx";
import { stateware } from "./store";
import router from "./routes";

const runMids = () => {
  app.use(store).use(router).use(stateware).use(VueSweetalert2).mount("#app");
};

runMids();
