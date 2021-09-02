const { Router } = require('express');
const authController = require('./auth.controller');

const router = Router();

router.post('/login', authController.login);
router.get('/valid', authController.valid);

module.exports = router;
