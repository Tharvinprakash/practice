const express = require("express");
const knex = require("../../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const client = require("../middleware/oAuth");
require("dotenv").config();
const { sendMail } = require("../../util/emailService");

function validation(name, email, password, phone_number) {
  let error = {};

  if (name.length < 6) {
    error.name = "name length atleast 6";
  }
  const validateEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!validateEmailRegex.test(email)) {
    error.email = "email is invalid";
  }

  if (password.length < 8) {
    error.password = "password length atleast 8";
  }

  if (phone_number.length != 10) {
    error.phone_number = "phone_number must be 10 numbers";
  }

  return error;
}

function reset(email, otp_expiration, password) {
  let error = {};

  const validateEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!validateEmailRegex.test(email)) {
    error.email = "email is invalid";
  }

  if (new Date(otp_expiration) < new Date()) {
    error.otp_expiration = "otp is expired";
  }

  if (password.length < 8) {
    error.password = "password length atleast 8";
  }

  return error;
}

exports.register = async (req, res) => {
  const { name, email, password, phone_number, role_id } = req.body;
  const error = validation(name, email, password, phone_number);
  const errLength = Object.keys(error).length;
  if (errLength > 0) {
    return res.status(400).send(error);
  }
  let user = await knex("users").where({email:email}).first();
  if(user){
    return res.status(200).json({message: "user already exists"});
  }
  const hashed = await bcrypt.hash(password, 10);
  await knex("users").insert({
    name: name,
    email: email,
    password: hashed,
    role_id: role_id,
    phone_number: phone_number,
  });
  return res.status(200).json({ message: "User registered successfully!" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "email is missing" });
  }

  if (!password) {
    return res.status(400).json({ message: "password is missing" });
  }

  const user = await knex("users")
    .where({ email: email.trim().toLowerCase() })
    .first();
  if (!user) {
    return res.status(404).json({ message: "email not exist" });
  }



  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(404).json({ message: "invalid password" });
  }
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  res.status(200).json({
    token: token,
    message: "user Loginned",
  });
};

exports.googleLogin = async (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });

  res.redirect(url);
};

exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleEmail = payload.email;
    const googleName = payload.name;
    const googleSub = payload.sub;

    let user = await knex("users").where({ email: googleEmail }).first();

    if (!user) {
      const [inserted_id] = await knex("users").insert({
        name: googleName,
        email: googleEmail,
        role_id: 3,
        google_id: googleSub,
      });


      user = await knex("users").where({ id: inserted_id }).first();

    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      message: "Google Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Google Login failed" });
  }
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "email not found" });
  }

  try {
    let user = await knex("users").where({ email: email }).first();

    let otp = Math.random() * 1000000;
    otp = Math.trunc(otp);
    console.log("otp", otp);
    let otp_expiration = new Date(Date.now() + 5 * 60 * 1000);

    await knex("users").where({ email: email }).update({
      otp: otp,
      otp_expiration: otp_expiration,
    });

    const emailBody = `your ${otp} is valid for 5 minutes`;

    const sent = await sendMail(email, "Password Reset OTP", emailBody);

    if (!sent)
      return res.status(500).json({ message: "Failed to send OTP email" });

    return res.status(200).json({ message: "otp sent" });
  } catch (error) {
    return res.status(400).json({ message: "otp not sent" });
  }
};

exports.verify = async (req, res) => {
  const { email, otp } = req.body;

  if (!email) {
    return res.status(400).json({ message: "email not found" });
  }
  if (!otp) {
    return res.status(400).json({ message: "otp not found" });
  }

  try {
    let user = await knex("users").where({ email: email }).first();
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user.otp != otp) {
      return res.status(400).json({ message: "otp is invalid" });
    }

    return res.status(200).json({message: "otp verified"});
  } catch (error) {
    return res.status(400).json({ message: "otp is mismatch" });
  }
};

exports.resetpassword = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "email not found" });
  }
  if (!otp) {
    return res.status(400).json({ message: "otp not found" });
  }
  if (!password) {
    return res.status(400).json({ message: "password not found" });
  }

  try {
    let user = await knex("users").where({ email: email }).first();
    if (user.otp != otp) {
      return res.status(400).json({ message: "otp is invalid" });
    }
    const error = reset(email, user.otp_expiration, password);
    const errLength = Object.keys(error).length;
    if (errLength > 0) {
      return res.status(400).send(error);
    }
    const hashed = await bcrypt.hash(password, 10);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (user) {
      await knex("users").where({ email: email }).update({
        password: hashed,
      });
      return res.status(200).json({ message: "password updated" });
    }
  } catch (error) {
    return res.status(400).json({ message: "password is not updated" });
  }
};
