const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('../../plugins');
const { schemas: { EntrySchema } } = require('@bwi/shared');

const entrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    queue_name: {
        type: String,
        required: true,
    },
});

// TODO: methods for checking existing entries
// add plugin that converts mongoose to json
entrySchema.plugin(toJSON);
entrySchema.plugin(paginate);

/**
 * @typedef Entry
 */
const EntryModel = mongoose.model('Entry', entrySchema);

class Entry {
    /**
     * Finds all entries by time string
     * @param {string} time
     */
    findByTime(time) {
        return this.find({
            time,
        }).exec();
    }

    /**
     * Finds all entries by date string
     * @param {Date} date
     */
    findByDate(date) {
        return this.find({
            date,
        }).exec();
    }

    async getEntries(params = null) {
        let result = this.find().exec();
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
    }

    async insertEntry(record) {
        let newRecord;
        if (!EntrySchema.validate(record).error) {
            const { date, time } = record;
            const isRecordBooked = await this.find({
                date,
                time,
            }).exec();
            if (!isRecordBooked) {
                newRecord = await this.insert(record);
                return { newRecord: newRecord[0], error: null };
            }
            return { record, error: "Failed making record.", code: 406 };
        }
        return { record, error: "Failed making record.", code: 412 };
    }
}

entrySchema.loadClass(Entry);

module.exports = EntryModel;
