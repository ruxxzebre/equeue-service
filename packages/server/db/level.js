const Keyv = require('keyv');
const path = require('path');
const { stateTypes } = require('@bwi/shared/constants');

const kvdb = new Keyv(`sqlite://${path.join(__dirname + '/kvdb.sqlite3')}`);

/**
 *
 * @param {string} confType
 * @param {object} newState
 * @return {Promise<void | null | any>}
 */
const setConfig = async (confType, newState) => {
  // polishing
  if (!stateTypes[confType]) return null;
  return await kvdb.set(confType, newState);
};

const clearConfig = async () => {
  return await kvdb.clear();
}

/**
 *
 * @param {string} confType
 * @return {Promise<void | null | any>}
 */
const getConfig = async (confType) => {
  if (!stateTypes[confType]) return null;
  return await kvdb.get(confType);
}

// yes
module.exports.ConfigDB = {
  setConfig,
  getConfig,
  clearConfig,
};
