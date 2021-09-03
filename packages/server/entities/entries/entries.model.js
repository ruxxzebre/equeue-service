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
        // trim: true,
        // lowercase: true,
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
    queue_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Queue',
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
EntryModel.findByTime = function (time) {
    return this.find({
        time,
    }).exec();
}
EntryModel.findByDate = function (date) {
    return this.find({
        date,
    }).exec();
}
EntryModel.insertEntry = async function(record) {
    const MAX_RECORDS_PER_TIME = 1;
    let newRecord;
    if (!EntrySchema.validate(record).error) {
        const { date, time } = record;
        const specificRecordsBooked = await this.find({
            date,
            time,
        }).exec().length;
        if (!specificRecordsBooked || specificRecordsBooked < MAX_RECORDS_PER_TIME) {
            newRecord = await this.create(record);
            return { newRecord: newRecord[0], error: null };
        }
        return { record, error: "Failed making record.", code: 406 };
    }
    return { record, error: "Failed making record.", code: 412 };
}
EntryModel.getEntries = async function(params = null) {
    let result = await this.find().exec();
    // TODO: REFACTOR QUERING ENTRIES
    if (!params) return { records: result, error: null };
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
};

module.exports = EntryModel;
