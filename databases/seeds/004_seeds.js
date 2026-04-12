const bcrypt = require("bcrypt");
exports.seed = async (knex) => {
  const hashed = await bcrypt.hash("12345678", 10);
  await knex("users").del();
  await knex("users").insert([
    {
      name: "Tharvin",
      email: "tharvin@example.com",
      password: hashed,
      role_id: 1,
      phone_number: 1234567890,
    },
    {
      name: "dharun",
      email: "tharvinprakash01@gmail.com",
      password: hashed,
      role_id: 1,
      phone_number: 1234567890,
    }
  ]);
};
