import { db } from './db';
import Joi from "joi";

export const BookMeetSchema = Joi.object({
  "date": Joi.string().required(),
  "name": Joi.string().required(),
  "phone": Joi.string().required(),
  "created_at": Joi.number(),
});

export const validatebookbody = (body) => {
  return !!BookMeetSchema.validate(body).error;
};

export const removeDateCollisions = (data) => {
  const datePool = [];
  return data.filter((thing) => {
    const includs = datePool.includes(thing.date);
    if (!includs) datePool.push(thing.date);
    return !includs;
  });
}

export const Booking = {
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
    if (!BookMeetSchema.validate(record).error) {
      const newRecord = await db('events').insert(record);
      return { newRecord: newRecord[0], error: null };
    }
    return { record, error: "Failed making record." } ;
  }
};
