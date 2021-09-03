const { Router } = require('express');
const queueController = {
    getQueue(req, res) {

    },
    makeQueue(req, res) {

    },
};

const router = Router();

router
    .get('/', queueController.getQueue)
    .post('/', queueController.makeQueue);

module.exports = router;