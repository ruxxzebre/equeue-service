const { Router } = require('express');
const { adminRouter, adminController } = require('./admin');
const { entriesRouter, entriesController, entriesModel } = require('./entries');
const { apiRouter } = require('./api');
const { authRouter, authService, authController } = require('./auth');
const { usersRouter, usersService, usersModel, usersController } = require('./users');
const { tokenModel, tokenService } = require('./token');

const router = Router();

router.use(adminRouter);
router.use(entriesRouter);
router.use(apiRouter);
router.use(usersRouter);
router.use('/auth', authRouter);

module.exports = {
    routers: router,
    adminRouter,
    adminController,
    entriesRouter,
    entriesController,
    entriesModel,
    authRouter,
    authController,
    authService,
    usersRouter,
    usersController,
    usersService,
    usersModel,
    tokenModel,
    tokenService,
}