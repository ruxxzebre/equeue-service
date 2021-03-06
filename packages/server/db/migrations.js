const { initializeState } = require("@bwi/shared/utils");
const { DateTime } = require("luxon");
const fs = require("fs");
const { ConfigDB } = require("./level");
const { stateTypes, amountPerFaculty } = require('@bwi/shared/constants');

const stateDefinedByTask = (stateType) => {
  return {
    bookingMaxPerEntry: amountPerFaculty[stateType],
    minuteInterval: 10,
    dayEndsAt: "17:50",
    availableDayFrom:
      DateTime.fromObject({ year: 2021, month: 8, day: 16 }).toString(),
    availableDayTo:
      DateTime.fromObject({ year: 2021, month: 9, day: 16 }).toString(),
    exclusiveDates: ["23-08-2021", "24-08-2021"],
    inclusiveDates: ["28-08-2021"],
    filterRules: ["weekend:2"],
  }
};

const levelMigrate = async () => {
  await ConfigDB.clearConfig();
  const ISWBMPEVal = (stateType) => initializeState(stateDefinedByTask(stateType));
  const { LAWYERS } = stateTypes;
  await ConfigDB.setConfig(LAWYERS, ISWBMPEVal(LAWYERS));
  console.log("LEVEL DB SUCCESSFULLY INITIALIZED.");
};

const squirrelMigrate = async () => {
  const demons = __dirname + '/db.sqlite3';
  let err;
  if (fs.existsSync(demons)) {
    err = await new Promise(r =>
      fs.unlink(__dirname + '/db.sqlite3', (err) => r(err)));
  }
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

(async () => {
  await levelMigrate();
  await squirrelMigrate();
})();
