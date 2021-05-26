// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.status(200).json({ name: 'John Doe' })
}

export default (req, res) => {
  if (req.method === 'POST') {
    if (req.body) {
      res.status(200).json(req.body);
    }
  }
}
