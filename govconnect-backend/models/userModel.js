const db = require("../config/db");

const createUser = async (user) => {
  const result = await db.query(
    `INSERT INTO users (first_name, last_name, email, password, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user.firstName, user.lastName, user.email, user.password, user.role]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};
