const { Router } = require('express');
const entriesController = require('./entries.controller');

const router = Router();

router
    .get('/entry', entriesController.getEntries)
    .post('/entry', entriesController.makeEntry);

module.exports = router;
