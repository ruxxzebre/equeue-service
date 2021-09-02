const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

/**
 * Returns array of needed arguments for express router
 * @param {string[] | string | null} rights - string or array of rights
 * @param {object | null} validator - Joi schema
 * @param {function(Request, Response)} controller - controller function
 */
const mapRouterArgs = (rights = null, validator = null, controller) => {
  const args = [];
  if (rights) {
    if (typeof rights === 'string') {
      args[0] = [rights];
    } else if (Array.isArray(rights)) {
      args[0] = rights;
    }
    args[0] = auth(args[0]);
  }
  if (validator) {
    args[1] = validate(validator);
  }
  args[args.length] = controller;
  return args;
};

module.exports.mapRouterArgs = mapRouterArgs;
