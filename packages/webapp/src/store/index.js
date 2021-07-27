import parse from "url-parse";

/**
 *
 * @typedef {object} StatewareOptions
 * @property {}
 */

export const stateware = {
  /**
   *
   * @param app
   * @param {StatewareOptions} options
   */
  // eslint-disable-next-line no-unused-vars
  install: (app, options) => {
    // console.log(app, options);
    const root = parse(window.location.href, true);
    if (root.pathname !== "/") return null;
    const { query } = root;
    let faculty;
    if (!query.faculty) {
      faculty = 2;
    } else {
      faculty = query.faculty;
    }
    console.log(faculty);
  },
};
