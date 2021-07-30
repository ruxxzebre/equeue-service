const { initializeState } = require("@bwi/shared/utils");
const { ConfigDB } = require("./level");
const { stateTypes, amountPerFaculty } = require('@bwi/shared/constants');

const levelMigrate = async () => {
  const ISWBMPEVal = (faculty) => initializeState({ bookingMaxPerEntry: amountPerFaculty[faculty], minuteInterval: 15 });
  const { PHILOLOGICAL_FACULTY, LAW_FACULTY, FIAT, HISTORY_FACULTY, FHBBT, ECONOMICS_FACULTY, FIM } = stateTypes;
  await ConfigDB.setConfig(PHILOLOGICAL_FACULTY, ISWBMPEVal(PHILOLOGICAL_FACULTY));
  await ConfigDB.setConfig(FIM, ISWBMPEVal(FIM));
  await ConfigDB.setConfig(LAW_FACULTY, ISWBMPEVal(LAW_FACULTY));
  await ConfigDB.setConfig(FIAT, ISWBMPEVal(FIAT));
  await ConfigDB.setConfig(HISTORY_FACULTY, ISWBMPEVal(HISTORY_FACULTY));
  await ConfigDB.setConfig(FHBBT, ISWBMPEVal(FHBBT));
  await ConfigDB.setConfig(ECONOMICS_FACULTY, ISWBMPEVal(ECONOMICS_FACULTY));
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
