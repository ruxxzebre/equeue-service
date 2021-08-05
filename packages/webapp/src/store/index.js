import parse from "url-parse";
import { defaultState, stateTypes } from "@bwi/shared/constants";
import { createStore } from "vuex";
import { API } from "../helpers/api";
import { storeObject } from "./vx";

/**
 *
 * @typedef {object} StatewareOptions
 * @property {string} queryName
 * @property {function} cb
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
      options.cb(app);
      store.dispatch("initEntry");
    });
  },
};
