module.exports = (db) =>
  db.model(
    'Reward',
    db.Schema(
      {
        name: { type: String, required: true },
        quota: { type: Number, required: true },
        claimed: { type: Number, default: 0 },
      },
      { timestamps: true }
    )
  );
