const Joi = require('joi');

const EntrySchema = Joi.object({
  "date": Joi.string().required(),
  "time": Joi.string().required(),
  "name": Joi.string().required(),
  "phone": Joi.string().required(),
  "created_at": Joi.number(),
});

exports.EntrySchema = EntrySchema;
