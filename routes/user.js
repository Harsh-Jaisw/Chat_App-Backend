const express = require("express");
const router = express.Router();
const User = require("../models/user");
const nodemailer = require("nodemailer");

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


router.get("/getall", async (req, res) => {
  try {
    const usersList = await User.find({});
    if (usersList.length > 0) {
      res
        .status(200)
        .json({ success: true, message: "Data of users", data: usersList });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//update user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("Account has been updated");
  } catch (err) {
    return res.status(500).json(err);
  }
  return res.status(403).json("You can update only your account!");
});
router.delete("/delete:id", (req, res) => {
  res.send("Delete by Id API");
});

// router.get("/verifyaccount/:id/:otp", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const { otp } = req.params;
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     console.log(typeof user.verificationCode, user);
//     if (user.verificationCode === null) {
//       return res
//         .status(200)
//         .json({ message: "Your account is already verified" });
//     }
//     if (user.verificationCode === otp) {
//       user.isVerfied = true;
//       user.verificationCode = undefined;
//       await user.save();
//       return res.status(200).render('');
//     } else {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.get('/otp',(req,res) => {
//   let testAccount = await nodemailer.createTestAccount();

//   let transporter = await nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "chatapp585@gmail.com",
//       pass: "sfmfgzccqbafvtmj",
//     },
//   });

//   let info = {
//     from: '"chatapp585@gmail.com"',
//     to: "bhavishm009@gmail.com",
//     subject: "Message",
//     text: "I hope this message gets delivered!",
//     html: "<b>Hello world?</b>",
//   };

//   transporter.sendMail(info, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(info);
//     }
//   });
//   console.log("Message sent: %s", info.messageId);
//   res.json(info);
// })
module.exports = router;
