const gachaService = require('./gacha-service');

async function gacha(request, response, next) {
  try {
    const { userId } = request.body;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ message: 'userId tidak valid' });
    }

    const result = await gachaService.doGacha(userId);

    return response.status(200).json({
      status: result.status,
      reward: result.reward,
    });
  } catch (error) {
    if (error.message === 'Limit 5x per hari') {
      return response.status(429).json({ message: error.message });
    }
    return next(error);
  }
}

async function history(request, response, next) {
  try {
    const { userId } = request.params;

    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ message: 'userId tidak valid' });
    }

    const data = await gachaService.getHistory(userId);

    return response.status(200).json({
      total: data.length,
      history: data,
    });
  } catch (error) {
    return next(error);
  }
}

async function limit(request, response, next) {
  try {
    const { userId } = request.params;

    const data = await gachaService.getLimit(userId);

    return response.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function rewards(request, response, next) {
  try {
    const data = await gachaService.getRewardsInfo();

    return response.status(200).json({
      total: data.length,
      rewards: data,
    });
  } catch (error) {
    return next(error);
  }
}

async function winners(request, response, next) {
  try {
    const data = await gachaService.getWinners();

    return response.status(200).json({
      total: data.length,
      winners: data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  gacha,
  history,
  limit,
  rewards,
  winners,
};
