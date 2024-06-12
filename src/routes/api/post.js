// src/routes/api/post.js

const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');

const router = express.Router();

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

router.post('/fragments', rawBody(), async (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    return res.status(400).json({ error: 'Invalid content type' });
  }

  try {
    const fragment = new Fragment({ id: 'generated-id', ownerId: req.user, data: req.body });
    await fragment.save();
    const location = new URL(
      `/v1/fragments/${fragment.id}`,
      process.env.API_URL || `http://${req.headers.host}`
    );
    res.setHeader('Location', location.toString());
    res.status(201).json({ fragment });
  } catch (err) {
    res.status(500).json({ error: 'Unable to save fragment' });
  }
});

module.exports = router;
