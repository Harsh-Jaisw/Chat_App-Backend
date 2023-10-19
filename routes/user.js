const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
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
    if (!user) {
      return res.status(404).json({success:false,message:"The user cannot be created"});
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
      return res.status(400).json({success:false,message:"Invalid Email or Mobile Number"});
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
    }
    else{
        res.status(405).json({success:false,message:"Invaid Password"})
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
module.exports = router;
