const { db } = require('../db');
const { schemas: { EntrySchema } } = require('@bwi/shared');

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
        }

        return { records: result, error: null };
    },
    async makeRecord(record) {
        let newRecord;
        if (!EntrySchema.validate(record).error) {
            const isRecordBooked = (await db('events')
                .where('date', record.date)
                .where('time', record.time)
                .select('*')).length;
            if (!isRecordBooked) {
                newRecord = await db('events').insert(record);
                return { newRecord: newRecord[0], error: null };
            }
            return { record, error: "Failed making record.", code: 406 };
        }
        return { record, error: "Failed making record.", code: 412 };
    },
    async updateRecord(record) {
        // NOTE: TEMPORARY OBSOLETE
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
