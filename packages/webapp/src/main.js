import "sweetalert2/dist/sweetalert2.min.css";

import "./registerServiceWorker";
import { app } from "./vueapp.js";
import { stateware } from "./store";

const runMids = () => {
  app.use(stateware);
};


runMids();
