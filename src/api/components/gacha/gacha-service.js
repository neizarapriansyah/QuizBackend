const repo = require('./gacha-repository');

const WIN_RATE = 0.4;

async function doGacha(userId) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const count = await repo.countToday(userId, start, end);
  if (count >= 5) {
    throw new Error('Limit 5x per hari');
  }

  const isWinChance = Math.random() < WIN_RATE;

  let reward = null;
  let isWin = false;

  if (isWinChance) {
    const rewards = await repo.getRewards();
    const available = rewards.filter((r) => r.claimed < r.quota);

    if (available.length > 0) {
      let totalWeight = 0;
      available.forEach((r) => {
        totalWeight += r.quota - r.claimed;
      });

      let rand = Math.random() * totalWeight;
      let selected = null;

      for (let r of available) {
        const remaining = r.quota - r.claimed;
        if (rand < remaining) {
          selected = r;
          break;
        }
        rand -= remaining;
      }

      if (selected) {
        const claimed = await repo.claimReward(selected._id);
        if (claimed && claimed.name) {
          reward = claimed;
          isWin = true;
        }
      }
    }
  }

  await repo.createLog({
    userId,
    rewardId: reward?._id || null,
    isWin,
  });

  return {
    status: isWin ? 'Win!' : 'Lose!',
    reward: reward?.name || null,
  };
}

function maskName(name) {
  if (!name) return '';
  if (name.length <= 2) return name;
  return name[0] + '****' + name[name.length - 1];
}

async function getHistory(userId) {
  const logs = await repo.getHistory(userId);
  return logs.map((log) => ({
    status: log.isWin ? 'Win!' : 'Lose!',
    reward: log.rewardId ? log.rewardId.name : null,
    date: log.createdAt,
  }));
}

async function getLimit(userId) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const count = await repo.countToday(userId, start, end);

  return {
    today: count,
    remaining: Math.max(0, 5 - count),
  };
}

async function getRewardsInfo() {
  const rewards = await repo.getRewardsWithQuota();

  return rewards.map((r) => ({
    name: r.name,
    quota: r.quota,
    claimed: r.claimed,
    remaining: Math.max(0, r.quota - r.claimed),
  }));
}

function randomMask(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => {
      if (word.length <= 1) return word;
      const mid = word
        .slice(1, -1)
        .split('')
        .map(() => '*')
        .join('');
      return word[0] + mid + word[word.length - 1];
    })
    .join(' ');
}

async function getWinners() {
  const logs = await repo.getWinners();

  return logs
    .filter((log) => log.rewardId)
    .map((log) => ({
      user: randomMask(log.userId.fullName),
      reward: log.rewardId.name,
      date: log.createdAt,
    }));
}

module.exports = {
  doGacha,
  getHistory,
  getLimit,
  getRewardsInfo,
  randomMask,
  getWinners,
};
