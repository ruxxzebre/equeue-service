const { Router } = require('express');
const { adminRouter } = require('./admin');
const { entriesRouter } = require('./entries');
const { apiRouter } = require('./api');

const router = Router();

router.use(adminRouter);
router.use(entriesRouter);
router.use(apiRouter);

module.exports.routers = router;