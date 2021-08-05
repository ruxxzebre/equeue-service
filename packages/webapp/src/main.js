// import "./registerServiceWorker";
import { app } from "./vueapp.js";
import { stateware } from "./store";
import router from "./routes";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

(() => {
  app.use(stateware,
    { queryName: "faculty",
      cb: (app) => {
        app.use(router);
        app.use(VueSweetalert2);
        app.mount("#app");
      }
    });
})();
