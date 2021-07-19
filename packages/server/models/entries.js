const { db } = require('../db');
const Joi = require('joi');

const EntrySchema = Joi.object({
  "date": Joi.string().required(),
  "time": Joi.string().required(),
  "name": Joi.string().required(),
  "phone": Joi.string().required(),
  "created_at": Joi.number(),
});

const validatebookbody = (body) => {
  return !!EntrySchema.validate(body).error;
};

const removeDateCollisions = (data) => {
  const datePool = [];
  return data.filter((thing) => {
    const includs = datePool.includes(thing.date);
    if (!includs) datePool.push(thing.date);
    return !includs;
  });
}

const Entry = {
  async getRecords(params = null) {
    let result = await db('events').select('*');
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          result = result.filter((record) => {
            if (record[key]?.match) {
              return record[key].match(new RegExp(params[key]));
            }
            return record[key] === params[key];
          });
        }
      });
      // let temp = [];
      // Object.keys(params).map(k => {
      //   temp.push(
      //     db('events').select('*').regexp(params[k])
      //   );
      // });
      // temp = await Promise.all(temp);
      // temp.forEach(t => result.push(...t));
    }

    if (result) return removeDateCollisions(result);
    return { records: result, error: null };
  },
  async makeRecord(record) {
    if (!EntrySchema.validate(record).error) {
      const newRecord = await db('events').insert(record);
      return { newRecord: newRecord[0], error: null };
    }
    return { record, error: "Failed making record." } ;
  }
};

module.exports.validatebookbody = validatebookbody;
module.exports.Entry = Entry;
module.exports.EntrySchema = EntrySchema;
