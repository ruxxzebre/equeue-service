const { initializeState } = require("./initCalendarState");
const { amountPerFaculty } = require("../constants");

const enumIncludes = (object, value) => {
  if (typeof object !== "object") return false;
  return Object.values(object).includes(value);
}

function createRange(from, to) {
  if (to <= from) return [];
  return Array(to + 1 - from)
    .fill(0)
    .map((_, idx) => from + idx);
}

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
