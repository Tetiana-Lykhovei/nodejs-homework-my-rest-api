const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
require("dotenv").config();

class CreateSenderSendGrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({
      ...msg,
      from: "Bla-Bla <euguen456@gmail.com>",
    });
  }
}

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);

    return await transporter.sendMail({
      ...msg,
      from: process.env.NODEMAILER_EMAIL,
    });
  }
}

module.exports = { CreateSenderSendGrid, CreateSenderNodemailer };
