const express = require('express');

const gachaController = require('./gacha-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/gacha', route);

  route.post('/', gachaController.gacha);
  route.get('/history/:userId', gachaController.history);
  route.get('/limit/:userId', gachaController.limit);
  route.get('/rewards', gachaController.rewards);
  route.get('/winners', gachaController.winners);
};
