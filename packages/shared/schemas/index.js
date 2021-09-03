const Joi = require('joi');

const EntrySchema = Joi.object({
  "name": Joi.string().required(),
  "phone": Joi.string().required(),
  "email": Joi.string(),
  "date": Joi.string().required(),
  "time": Joi.string().required(),
  "queue_name": Joi.string(),
});

module.exports.EntrySchema = EntrySchema;
