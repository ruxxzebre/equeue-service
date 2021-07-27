const level = require('level');
const path = require('path');
const { stateTypes } = require('@bwi/shared/constants');
// const { initializeState } = require('@bwi/shared/utils');

const kvdb = level(path.join(__dirname + '/db.level'));

/**
 *
 * @param {string} confType
 * @return {Promise<void | null | any>}
 */
const setConfig = async (confType, newState) => {
  if (!stateTypes[confType]) return null;
  return await kvdb.put(confType, JSON.stringify(newState));
};

/**
 *
 * @param {string} confType
 * @return {Promise<void | null | any>}
 */
const getConfig = async (confType) => {
  if (!stateTypes[confType]) return null;
  return JSON.parse(await kvdb.get(confType));
}

const ConfigDB = {
  setConfig,
  getConfig,
};

// ConfigDB.setConfig(stateTypes.FIM, { junk: 'dumb' });

setTimeout(async () => {
  console.log(await ConfigDB.getConfig(stateTypes.FIM));
}, 500);

// yes
module.exports.configDB = ConfigDB;
