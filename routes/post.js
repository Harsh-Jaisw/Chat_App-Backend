const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");
const multer = require("multer");
const fs = require("fs");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Hello");
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: (req, file, cb) => {
    console.log("help");
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.post("/posts", uploadOptions.single("image"), async (req, res) => {
  console.log(req.body);
  const { description } = req.body;

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (!description) {
    // If description is missing, send a 400 Bad Request response
    return res.status(400).json({
      message: "Description is required",
      success: false,
    });
  }

  const imagePath = `${basePath}${fileName}`;

  let post = new Post({
    createdBy: "65892429b0e125522fe08bf5",
    image: imagePath,
    description: description,
  });

  try {
    post = await post.save();
    console.log(post);
    res.status(200).json({
      Data: post,
      Success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    console.log("err",error)
    return res.status(500).json({ Success: false, message: "Post cannot be created" });
  }
});



// router.post("/", uploadOptions.single("image"), async (req, res) => {
//   console.log(req.body);
//   const { description, image } = req.body;

//   const fileName = req.file.filename;
//   const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

//   if (!description || !image) {
//     return res
//       .status(400)
//       .json({
//         message: "Both description and image are required",
//         success: false,
//       });
//   }

//   let post = new Post({
//     createdBy: "65369726545eea2a86922a85",
//     image: `${basePath}${fileName}`,
//     description:description,
//   });

//   try {
//     post = await post.save();
//     console.log(post);
//     res.status(200).json({
//       Data: post,
//       Success: true,
//       message: "Post created successfully",
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ Success: false, message: "Post cannot be created" });
//   }
// });

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like / dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;