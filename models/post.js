const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    createdBy: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      max: 500,
      required:true
    },
    image: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);