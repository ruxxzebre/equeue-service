const Joi = require('joi');

const EntrySchema = Joi.object({
  "date": Joi.string().required(),
  "time": Joi.string().required(),
  "people": Joi.array().items(Joi.object({
    "name": Joi.string().required(),
    "phone": Joi.string().required(),
  })),
  "created_at": Joi.any(),
  "counter": Joi.number(),
  "id": Joi.number(),
});

module.exports.EntrySchema = EntrySchema;
