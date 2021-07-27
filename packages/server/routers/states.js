const { Router } = require('express');
const { ConfigDB } = require('../db/level');

const router = Router();

router.get('/getState', async (req, res) => {
  if (!req.query.stateType) return res.sendStatus(404);
  const stateToFetch = await ConfigDB.getConfig(req.query.stateType);
  if (!stateToFetch) return res.sendStatus(400);
  res.send(stateToFetch);
})

module.exports = router;
