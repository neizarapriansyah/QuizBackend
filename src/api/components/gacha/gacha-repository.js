const { Reward, GachaLog } = require('../../../models');

async function countToday(userId, start, end) {
  return GachaLog.countDocuments({
    userId,
    createdAt: { $gte: start, $lte: end },
  });
}

async function getRewards() {
  return Reward.find({});
}

async function claimReward(rewardId) {
  return Reward.findOneAndUpdate(
    {
      _id: rewardId,
      $expr: { $lt: ['$claimed', '$quota'] },
    },
    { $inc: { claimed: 1 } },
    { new: true }
  );
}

async function createLog(data) {
  return GachaLog.create(data);
}

async function getHistory(userId) {
  return GachaLog.find({ userId })

    .populate('rewardId')
    .sort({ createdAt: -1 });
}

async function getRewardsWithQuota() {
  return Reward.find({});
}

async function getWinners() {
  return GachaLog.find({
    isWin: true,
    rewardId: { $ne: null },
  })
    .populate('userId')
    .populate('rewardId')
    .sort({ createdAt: -1 });
}

module.exports = {
  countToday,
  getRewards,
  claimReward,
  createLog,
  getHistory,
  getRewardsWithQuota,
  getWinners,
};
