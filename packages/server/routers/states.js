const { Router } = require('express');
const { ConfigDB } = require('../db/level');

const router = Router();

router.get('/get-state', async (req, res) => {
  console.log(req.query);
  if (!req.query.stateType) return res.sendStatus(404);
  console.log(req.query.stateType);
  const stateToFetch = await ConfigDB.getConfig(req.query.stateType);
  if (!stateToFetch) return res.sendStatus(400);
  res.send(stateToFetch);
})

module.exports = router;
