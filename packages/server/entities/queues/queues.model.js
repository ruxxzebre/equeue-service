const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('../../plugins');

const queueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    descriptionText: {
        type: String,
        required: true,
        trim: true,
    },
    // JLisp string to be transpiled
    queryString: {
        type: String,
        required: true,
        trim: true,
    }
});

// add plugin that converts mongoose to json
queueSchema.plugin(toJSON);
queueSchema.plugin(paginate);

/**
 * @typedef Queue
 */
const QueueModel = mongoose.model('Queue', queueSchema);


module.exports = QueueModel;
