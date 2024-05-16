const Express = require('express');

const router = new Express.Router();

const delay = (ms = 3000) => new Promise(res => setTimeout(res, ms));

router.get('/books', async (_req, res) => {
  await delay();
  res.status(200);
  res.json(require('./mock/books.json'));
});

router.get('/users', async (_req, res) => {
  await delay();
  res.status(200);
  res.json(require('./mock/users.json'));
});

module.exports = router;
