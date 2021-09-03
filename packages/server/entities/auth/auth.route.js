const { Router } = require('express');
const authController = require('./auth.controller');

const router = Router();

router
    .post('/login', authController.login)
    .get('/valid', authController.valid);

module.exports = router;
