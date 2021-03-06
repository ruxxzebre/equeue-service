import parse from "url-parse";
import { defaultState, stateTypes, stateStrings } from "@bwi/shared/constants";
import { createStore } from "vuex";
import { API } from "../helpers/api";
import { storeObject } from "./vx";
import { storeGlobal } from "./sg";

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
    // if (root.pathname !== "/") return options.cb(false);
    const { query } = root;
    let queryValue;
    if (!query[options.queryName] || !stateTypes[query[options.queryName]]) {
      queryValue = defaultState;
    } else {
      queryValue = query[options.queryName];
    }
    API.get(`/get-state?stateType=${queryValue}`).then(
      async ({ data: state }) => {
        // TODO: rename faculty to queryTypeName
        storeObject.state = state;
        storeObject.state.faculty = queryValue;
        const store = createStore({
          modules: {
            calendarManagement: storeObject,
            global: storeGlobal,
          },
        });

        const stateString = stateStrings[storeObject.state.faculty];
        document.title = stateString.heading;

        app.use(store);
        await store.dispatch("initEntry"); // load entries immediately
        setInterval(() => {
          store.dispatch("initEntry");
        }, 5000); // fetch entries every 5 seconds
        options.cb(true);
        // TODO: implement webhooks
      }
    );
  },
};
