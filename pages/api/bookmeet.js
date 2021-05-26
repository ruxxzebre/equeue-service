// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Joi from 'joi';
import { bookEvent, db } from "../../lib/db";

const BookMeetSchema = Joi.object({
  "date": Joi.string(),
  "name": Joi.string(),
  "phone": Joi.string()
});

export default async (req, res) => {
  res.status(200).json({ name: 'John Doe' });
};

const validatebookbody = (body) => {
 return !!BookMeetSchema.validate(body).error;
};
export default async (req, res) => {
  if (req.method === 'GET') {
    if (req.body) {
      res.status(200).json(req.body);
    }
  }
  if (req.method === 'POST') {
    if (validatebookbody(req.body)) {
      const event = req.body;
      const result = await bookEvent(event);
      if (result.error)
        return res.status(400).send(result)
      else
        return res.send(result);
    }
  }
}
