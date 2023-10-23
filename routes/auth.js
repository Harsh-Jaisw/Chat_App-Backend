const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

function SendMail(user_name, user_email, verificationCode, user_id) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chatapp585@gmail.com",
      pass: "sfmfgzccqbafvtmj",
    },
  });

  let info = {
    from: '"chatapp585@gmail.com"',
    to: `${user_email}`,
    subject: ` Hello,Mr/Mrs : ${user_name}, /n Your Chat App Verification Code`,
    text: `Hello,Mr/Mrs : ${user_name}, We Are Happy Have You On Board 👌😀`,
    html: `<body style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: #ffffff; max-width: 600px; margin: auto; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #333;">Email Verification</h1>
          <p style="color: #555; font-size: 16px;">Dear ${user_name},</p>
          <p style="color: #555; font-size: 16px;">Thank you for registering with our platform. To get started, please click the link below to verify your email address:</p>
          <a href="http://localhost:7000/api/verifyaccount/${user_id}/${verificationCode}" style="display: inline-block; text-decoration: none; background-color: #007bff; color: #ffffff; padding: 10px 20px; font-size: 16px; border-radius: 5px; margin-top: 20px;">Verify Email</a>
          <p style="color: #555; font-size: 16px; margin-top: 20px;">If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
          <strong style="color: #555; font-size: 16px;">${verificationCode}</strong>
          <p style="color: #555; font-size: 16px;">Thank you for using our platform!</p>
        </div>
      </body>`,
  };

  transporter.sendMail(info, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent.");
    }
  });
}

router.post("/login", async (req, res) => {
  try {
    const userByEmail = await User.findOne({ email: req.body.email });
    if (!userByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Mobile Number" });
    }
    if (
      userByEmail &&
      bcrypt.compareSync(req.body.password, userByEmail.password)
    ) {
      const token = jwt.sign(
        {
          _id: userByEmail._id,
        },
        process.env.SECRET,
        { expiresIn: "1d" }
      );
      return res
        .status(200)
        .json({ success: true, Message: "Login Successful", token });
    } else {
      res.status(405).json({ success: false, message: "Invaid Password" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  console.log("hello");
  function generateRandomNumber() {
    return Math.floor(Math.random() * 900000) + 100000;
  }
  const verificationCode = generateRandomNumber();
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      password: bcrypt.hashSync(req.body.password, 10),
      verificationCode: verificationCode,
    });
    console.log(user._id);
    SendMail(req.body.name, req.body.email, verificationCode, user._id);
    user = await user.save();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "The user cannot be created" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Registration Successful.",
        user_id: user._id,
      });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/verifyaccount/:id/:otp", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { otp } = req.params;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(typeof user.verificationCode, user);
    if (user.verificationCode === null) {
      return res
        .status(200)
        .json({ success: false, message: "Your account is already verified" });
    }
    if (user.verificationCode === otp) {
      user.isVerfied = true;
      user.verificationCode = undefined;
      await user.save();
      return res.status(200).json({ success: true, message: "Your account is already verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
