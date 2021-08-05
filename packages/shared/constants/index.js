const stateTypes = {
  LAWYERS: "LAWYERS",
};

const defaultState = stateTypes.LAWYERS;

// TODO
const stateStrings = {
  [stateTypes.LAWYERS]: {
    heading: "Юридичний відділ",
    description: "філософствуєм"
  },
};

const amountPerFaculty = {
  [stateTypes.LAWYERS]: 1,
};

module.exports.stateTypes = stateTypes;
module.exports.defaultState = defaultState;
module.exports.amountPerFaculty = amountPerFaculty;
module.exports.stateStrings = stateStrings;
