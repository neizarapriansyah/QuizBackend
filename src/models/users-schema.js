module.exports = (db) =>
  db.model(
    'Users',
    db.Schema(
      {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        fullName: { type: String, required: true },
      },
      { timestamps: true }
    )
  );
