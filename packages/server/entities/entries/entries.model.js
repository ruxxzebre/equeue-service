const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('../../plugins');

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
const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
