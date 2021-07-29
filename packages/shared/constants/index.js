const stateTypes = {
  PHILOSOPHY_FACULTY: "PHILOSOPHY_FACULTY",
  LAW_FACULTY: "LAW_FACULTY",
  FIAT: "FIAT",
  HISTORY_FACULTY: "HISTORY_FACULTY",
  FHBBT: "FHBBT",
  ECONOMICS_FACULTY: "ECONOMICS_FACULTY",
  FIM: "FIM",
};

// TODO
const facultyStrings = {
  [stateTypes.PHILOSOPHY_FACULTY]: {
    heading: "Філософський факультет",
    description: "філософствуєм"
  },
  [stateTypes.LAW_FACULTY]: {
    heading: "Юридичний факультет",
    description: "філософствуєм"
  },
  [stateTypes.FIAT]: {
    heading: "ФІПТ",
    description: "філософствуєм"
  },
  [stateTypes.HISTORY_FACULTY]: {
    heading: "Історії та міжнародних відносин",
    description: "філософствуєм"
  },
  [stateTypes.FHBBT]: {
    heading: "ФХББТ",
    description: "філософствуєм"
  },
  [stateTypes.ECONOMICS_FACULTY]: {
    heading: "Економічний факультет ",
    description: "філософствуєм"
  },
  [stateTypes.FIM]: {
    heading: "ФІМ",
    description: "філософствуєм"
  },
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
module.exports.facultyStrings = facultyStrings;
