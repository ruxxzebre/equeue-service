const { Semaphore } = require("@bwi/shared/utils");
const throttler = new Semaphore(1);

module.exports = throttler;