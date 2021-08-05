const { initializeState } = require("@bwi/shared/utils");
const { ConfigDB } = require("./level");
const { stateTypes, amountPerFaculty } = require('@bwi/shared/constants');

const levelMigrate = async () => {
  const ISWBMPEVal = (stateType) => initializeState({ bookingMaxPerEntry: amountPerFaculty[stateType], minuteInterval: 15 });
  const { LAWYERS } = stateTypes;
  await ConfigDB.setConfig(LAWYERS, ISWBMPEVal(LAWYERS));
};

const squirrelMigrate = async () => {
  console.log('TODO');
};

// levelMigrate().then(() => {
//   console.log('flex');
//   ConfigDB.getConfig(stateTypes.PHILOLOGICAL_FACULTY).then((a) => {
//     console.log(a);
//   });
// });
levelMigrate();
