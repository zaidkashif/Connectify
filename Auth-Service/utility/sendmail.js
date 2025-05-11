
const nodemailer = require('nodemailer');
require('dotenv').config();


const sendAccountDeletionEmail = async (toEmail, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ma.mujtaba12@gmail.com',
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: '"Connectify" <ma.mujtaba12@gmail.com>',
      to: toEmail,
      subject: 'Your Account Has Been Deleted',
      text: `Hello ${name},\n\nWe are sorry to see you go. Your account on Connectify has been deleted successfully.\n\nIf you have any questions, feel free to reach out to us.
        \n Tusi ja rhe ho Tusi na jao
        \n\nBest regards,\nConnectify Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(mailOptions);
    console.log('Email sent to', toEmail, 'Response:', info.response);
    console.log('Account deletion email sent to', toEmail);
  } catch (error) {
    console.error('Error sending account deletion email:', error.message);
  }
};

const sendRegistrationEmail = async (toEmail, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ma.mujtaba12@gmail.com',
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: '"Connectify" <ma.mujtaba12@gmail.com>',
      to: toEmail,
      subject: 'Welcome to Connectify 🎉',
      text: `Hello ${name},\n\nYou are registered successfully on Connectify. Congratulations!\n\nBest regards,\nConnectify Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent to', toEmail, 'Response:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ma.mujtaba12@gmail.com',
      pass: process.env.PASS,
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

console.log('sendmail.js loaded');
module.exports = { sendRegistrationEmail, sendAccountDeletionEmail, sendOTPEmail };
