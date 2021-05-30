// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Joi from 'joi';
import caseExporterXL from '../../lib/caseExporterXL';
import { Booking, BookMeetSchema } from "../../lib/bookCrud";

export default async (req, res) => {
  if (req.method === 'GET') {
    const params = {};
    let records;
    const q = req.query;
    if (parseInt(q.id, 10)) params.id = parseInt(q.id, 10);
    if (q.name) params.name = q.name;
    if (q.date) params.date = q.date;
    if (q.phone) params.phone = q.phone;

    if (!Object.keys(params).length)
      records = await Booking.getRecords();
    else
      records = await Booking.getRecords(params);
    return await caseExporterXL(res, records);
  }
  res.send(400);
}
