const { initializeState } = require("./initCalendarState");
const { amountPerFaculty } = require("../constants");
const { enumIncludes, createRange } = require("./misc");

const initializedStatesPerFaculty = (() => {
  const states = {};
  Object.keys(amountPerFaculty).map((key) => {
    states[key] = initializeState({ bookingMaxPerEntry: amountPerFaculty[key] });
  });
  return states;
})();

module.exports.enumIncludes = enumIncludes;
module.exports.createRange = createRange;
module.exports.initializeState = initializeState;
module.exports.initializedStatesPerFaculty = initializedStatesPerFaculty;
