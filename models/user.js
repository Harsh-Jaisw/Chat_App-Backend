const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    friends:{
      type:Array,
      default:[]
    },
    profilePicture:{
      type:String,
    },
    Photos:{
      type:Array,
      default:[]
    },
    isVerfied:{
      type:Boolean,
      default:false
    },
    verificationCode:{
      type:String,
    }
  
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);
