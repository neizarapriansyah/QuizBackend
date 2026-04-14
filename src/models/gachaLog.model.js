module.exports = (db) =>
  db.model(
    'GachaLog',
    db.Schema(
      {
        userId: {
          type: db.Schema.Types.ObjectId,
          ref: 'Users',
          required: true,
        },
        rewardId: {
          type: db.Schema.Types.ObjectId,
          ref: 'Reward',
          default: null,
        },
        isWin: { type: Boolean, default: false },
      },
      { timestamps: true }
    )
  );
