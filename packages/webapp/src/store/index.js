import parse from "url-parse";
import { defaultState, stateTypes } from "@bwi/shared/constants";
import { createStore } from "vuex";
import { API } from "../helpers/api";
import { storeObject } from "./vx";
import router from "../routes";
import VueSweetalert2 from "vue-sweetalert2";

/**
 *
 * @typedef {object} StatewareOptions
 * @property {string} queryName
 */

export const stateware = {
  /**
   *
   * @param app
   * @param { StatewareOptions } options
   */
  install: (app, options) => {
    const root = parse(window.location.href, true);
    if (root.pathname !== "/") return null;
    const { query } = root;
    let queryValue;
    if (!query[options.queryName] || !stateTypes[query[options.queryName]]) {
      queryValue = defaultState;
    } else {
      queryValue = query[options.queryName];
    }
    API.get(`/get-state?stateType=${queryValue}`).then(({ data: state }) => {
      storeObject.state = state;
      storeObject.state.faculty = queryValue;
      const store = createStore(storeObject);
      app.use(store);
      app.use(router).use(VueSweetalert2).mount("#app");
      store.dispatch("initEntry");
    });
  },
};
