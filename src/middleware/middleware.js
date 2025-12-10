const jwt = require("jsonwebtoken");
const knex = require("../../config/db");
require("dotenv").config();

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ message: "Token is missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "invalid token" });
  }
}

async function permissionCheck(req, res, next, permissions) {
  console.log("Customer validation begins");
  try {

    const roleId = req.user.role_id;

    const roles = await knex("role_permission as rp")
      .leftJoin("permissions as p", "rp.permission_id", "p.id")
      .where("rp.role_id", roleId)
      .select("p.name", "rp.value");

    permissions.split(",").map((role) => {
      const find = roles.find((d) => d.name == role);
      if (!find || (find && find.value == 0)) {
        return res.status(403).json({
          message: `not authorized to ${role}`,
        });
      }
    });

    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Unauthorized to create staff" });
  }
}



module.exports = {
  verifyToken,
  permissionCheck,
};
