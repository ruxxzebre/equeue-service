import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import VueSweetalert2 from "vue-sweetalert2";
import store from "./store/vx";
import router from "./routes";
import "sweetalert2/dist/sweetalert2.min.css";

const app = createApp(App);

app
  .use(store)
  // .use(router)
  .use(VueSweetalert2)
  .mount("#app");
