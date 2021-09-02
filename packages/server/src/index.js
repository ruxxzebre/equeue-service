const { Router } = require('express');
const { adminRouter } = require('./admin');
const { entriesRouter } = require('./entries');
const { apiRouter } = require('./api');
const { authRouter } = require('./auth');

const router = Router();

router.use(adminRouter);
router.use(entriesRouter);
router.use(apiRouter);
router.use('/auth', authRouter);

module.exports.routers = router;