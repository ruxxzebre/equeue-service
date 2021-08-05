const { initializeState } = require("@bwi/shared/utils");
const fs = require("fs");
const { ConfigDB } = require("./level");
const { stateTypes, amountPerFaculty } = require('@bwi/shared/constants');

const levelMigrate = async () => {
  const ISWBMPEVal = (stateType) => initializeState({ bookingMaxPerEntry: amountPerFaculty[stateType], minuteInterval: 15 });
  const { LAWYERS } = stateTypes;
  await ConfigDB.setConfig(LAWYERS, ISWBMPEVal(LAWYERS));
  console.log("LEVEL DB SUCCESSFULLY INITIALIZED.");
};

const squirrelMigrate = async () => {
  const err = await new Promise(r =>
    fs.unlink(__dirname + '/db.sqlite3', (err) => r(err)));
  if (err && err.errno !== -2) {
    throw new Error("Something happened when removing db");
  }
  fs.writeFileSync(__dirname + '/db.sqlite3', "");
  const { initializeDB } = require("./db");
  initializeDB(true, false).then(() => {
    console.log("SQLITE DB SUCCESSFULLY INITIALIZED.");
    process.exit(0);
  });
};

// levelMigrate().then(() => {
//   console.log('flex');
//   ConfigDB.getConfig(stateTypes.PHILOLOGICAL_FACULTY).then((a) => {
//     console.log(a);
//   });
// });
levelMigrate();
squirrelMigrate();
