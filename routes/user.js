const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

 function SendMail (user_name, user_email) {
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
        <a href="{verificationLink}" style="display: inline-block; text-decoration: none; background-color: #007bff; color: #ffffff; padding: 10px 20px; font-size: 16px; border-radius: 5px; margin-top: 20px;">Verify Email</a>
        <p style="color: #555; font-size: 16px; margin-top: 20px;">If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="color: #555; font-size: 16px;"></p>
        <p style="color: #555; font-size: 16px;">Thank you for using our platform!</p>
      </div>
    </body>`,
  };

  transporter.sendMail(info, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email Sent.');
    }
  });
}

router.get("/gitHubJson", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Gwenborough",
        zipcode: "92998-3874",
        geo: {
          lat: "-37.3159",
          lng: "81.1496",
        },
      },
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: {
        name: "Romaguera-Crona",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets",
      },
    },
    {
      id: 2,
      name: "Ervin Howell",
      username: "Antonette",
      email: "Shanna@melissa.tv",
      address: {
        street: "Victor Plains",
        suite: "Suite 879",
        city: "Wisokyburgh",
        zipcode: "90566-7771",
        geo: {
          lat: "-43.9509",
          lng: "-34.4618",
        },
      },
      phone: "010-692-6593 x09125",
      website: "anastasia.net",
      company: {
        name: "Deckow-Crist",
        catchPhrase: "Proactive didactic contingency",
        bs: "synergize scalable supply-chains",
      },
    },
  ]);
});
router.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    user = await user.save();
    SendMail(req.body.name, req.body.email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "The user cannot be created" });
    }
    res.status(200).json({ success: true, Data: user });
  } catch (error) {
    res.status(400).send(error);
  }
});
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
router.get("/getAll", (req, res) => {
  res.send("Get All Api");
});
router.get("/getOne:id", (req, res) => {
  res.send(req.params.id);
});
router.patch("/update:id", (req, res) => {
  res.send("update by Id API");
});
router.delete("/delete:id", (req, res) => {
  res.send("Delete by Id API");
});

router.get("/otp", async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = await nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chatapp585@gmail.com",
      pass: "sfmfgzccqbafvtmj",
    },
  });

  let info = {
    from: '"chatapp585@gmail.com"',
    to: "bhavishm009@gmail.com",
    subject: "Message",
    text: "I hope this message gets delivered!",
    html: "<b>Hello world?</b>",
  };

  transporter.sendMail(info, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  console.log("Message sent: %s", info.messageId);
  res.json(info);
});
module.exports = router;
