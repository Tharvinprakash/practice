const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


async function sendMail(to,subject,text){
    try {
        await transporter.sendMail({
            from:process.env.EMAIL_FROM,
            to,
            subject,
            text
        })
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = {sendMail};