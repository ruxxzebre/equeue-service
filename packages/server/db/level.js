const level = require('level');
const path = require('path');
const { stateTypes } = require('@bwi/shared/constants');

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

// yes
module.exports.configDB = ConfigDB;
