const { Semaphore } = require("@bwi/shared/utils");

const { Router } = require('express');
const { Entry } = require('../models/entries');
const { schemas } = require('@bwi/shared');
const caseExporterXL = require("@bwi/shared/exporter");
const { EntrySchema } = schemas;

const throttler = new Semaphore(1);
const router = Router();

router.get('/export', async (req, res) => {
  const params = {};
  let records;
  const q = req.query;
  if (parseInt(q.id, 10)) params.id = parseInt(q.id, 10);
  if (q.name) params.name = q.name;
  if (q.date) params.date = q.date;
  if (q.phone) params.phone = q.phone;

  if (!Object.keys(params).length)
    records = await Entry.getRecords();
  else
    records = await Entry.getRecords(params);
  return await caseExporterXL(res, records);
});

router.get('/entry',async  (req, res) => {
  const params = {};
  const q = req.query;
  if (parseInt(q.id, 10)) params.id = parseInt(q.id, 10);
  if (q.name) params.name = q.name;
  if (q.date) params.date = q.date;
  if (q.phone) params.phone = q.phone;

  if (!Object.keys(params).length) {
    return res.send(await Entry.getRecords());
  }
  return res.send(await Entry.getRecords(params));
});

router.post('/entry', async (req, res) => {
  if (!EntrySchema.validate(req.body).error) {
    const event = req.body;
    const result = await throttler.callFunction(() => Entry.updateRecord(event));
    if (result.error) return res.status(400).send(result);
    else return res.send(result);
  }
  return res.status(400).send(EntrySchema.validate(req.body));
});

module.exports = router;
