const { Router } = require('express');
const entriesController = require('./entries.controller');
const validate = require("../../middlewares/validate");
const { EntrySchema } = require("@bwi/shared/schemas");

const router = Router();

router
    .get('/entry', entriesController.getEntries)
    .post('/entry', validate(EntrySchema), entriesController.makeEntry);

module.exports = router;
