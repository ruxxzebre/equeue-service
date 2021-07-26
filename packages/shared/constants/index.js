const stateTypes = {
  PHILOSOPHY_FACULTY: "PHILOSOPHY_FACULTY",
  LAW_FACULTY: "LAW_FACULTY",
  FIAT: "FIAT",
  HISTORY_FACULTY: "HISTORY_FACULTY",
  FHBBT: "FHBBT",
  ECONOMICS_FACULTY: "ECONOMICS_FACULTY",
  FIM: "FIM",
};

const amountPerFaculty = {
  [stateTypes.PHILOSOPHY_FACULTY]: 2,
  [stateTypes.LAW_FACULTY]: 3,
  [stateTypes.FIAT]: 3,
  [stateTypes.HISTORY_FACULTY]: 2,
  [stateTypes.FHBBT]: 2,
  [stateTypes.ECONOMICS_FACULTY]: 4,
  [stateTypes.FIM]: 2,
};

module.exports.stateTypes = stateTypes;
module.exports.amountPerFaculty = amountPerFaculty;
