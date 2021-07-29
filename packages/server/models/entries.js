const { db } = require('../db');
const { schemas: { EntrySchema } } = require('@bwi/shared');

const removeDateCollisions = (data) => {
  return data;
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
  async makeRecord(record, update = false) {
    if (!EntrySchema.validate(record).error) {
      const newRecord = await
        (update ? db('events').update(record) : db('events').insert(record));
      return { newRecord: newRecord[0], error: null };
    }
    return { record, error: "Failed making record." } ;
  },
  async updateRecord(record) {
    let patch = true;
    if (patch) {
      delete record.id;
      return this.makeRecord(record);
    }

    const rec = record.id &&
      await db('events').where('id', record.id).select('*');
    if (!rec) {
      return this.makeRecord(record);
    }
    return this.makeRecord(record, true);
  },
};

module.exports.Entry = Entry;
