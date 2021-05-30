// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Joi from 'joi';
import { Booking, BookMeetSchema } from "../../lib/bookCrud";

export default async (req, res) => {
  if (req.method === 'GET') {
    const params = {};
    const q = req.query;
    if (parseInt(q.id, 10)) params.id = parseInt(q.id, 10);
    if (q.name) params.name = q.name;
    if (q.date) params.date = q.date;
    if (q.phone) params.phone = q.phone;

    if (!Object.keys(params).length)
      return res.send(await Booking.getRecords());
    return res.send(await Booking.getRecords(params));
  }
  if (req.method === 'POST') {
    if (!BookMeetSchema.validate(req.body).error) {
      const event = req.body;
      const result = await Booking.makeRecord(event);
      if (result.error)
        return res.status(400).send(result);
      else
        return res.send(result);
    }
    return res.status(400).send(BookMeetSchema.validate(req.body));
  }
}
