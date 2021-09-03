const { Router } = require("express");
const adminController = require("./admin.controller");
const router = Router();

router.get('/export', adminController.exportEntries);

module.exports = router;
