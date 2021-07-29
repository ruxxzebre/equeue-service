const { Router } = require('express');
const { ConfigDB } = require('../db/level');
const { stateTypes } = require('@bwi/shared/constants');

const router = Router();

router.get('/get-state', async (req, res) => {
  console.log(req.query);
  if (!req.query.stateType) return res.sendStatus(404);
  const stateToFetch = await ConfigDB.getConfig(req.query.stateType);
  if (!stateToFetch) return res.sendStatus(400);
  res.send(stateToFetch);
});

router.get('/get-all-states', async (req, res) => {
  const states = {};
  for (let i in stateTypes) {
    states[i] = await ConfigDB.getConfig(i);
  }
  res.send(states);
});

module.exports = router;
