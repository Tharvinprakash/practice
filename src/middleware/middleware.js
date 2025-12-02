const jwt = require("jsonwebtoken");
const knex = require("../../config/db");
require("dotenv").config();

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ message: "Token is missing" });
  }

  const token = authHeader.split(" ")[1];
  // console.log({ token: process.env.JWT_SECRET });

  if (!token) {
    return res.status(400).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    req.user = decoded;
    next();
    // res.status(200).json({ message: "Authorized" })
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "invalid token" });
  }
}

async function permissionCheck(req, res, next, permissions) {
  console.log("Customer validation begins");
  try {
    // console.log(req.user);

    const roleId = req.user.role_id;
    // console.log(roleId);

    const roles = await knex("role_permission as rp")
      .leftJoin("permissions as p", "rp.permission_id", "p.id")
      .where("rp.role_id", roleId)
      .select("p.name", "rp.value");

    // console.log(role)
    permissions.split(",").map((role) => {
      const find = roles.find((d) => d.name == role);
      if (!find || (find && find.value == 0)) {
        return res.status(403).json({
          message: `not authorized to ${role}`,
        });
      }
    });

    // const {role_id} = req.body;
    // console.log(role_id);

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
