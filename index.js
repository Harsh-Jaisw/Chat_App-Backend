require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

//Importing Routes Here
const userRoutes = require("./routes/user");
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post')



//Middleware's Here
app.use(cors());
app.use(express.json());




const mongoString =
  process.env.NODE_ENV === "development"
    ? "mongodb://localhost:27017/ChatApp"
    : process.env.DATABASE_URL;

//Connecting to Database Here
mongoose
  .connect(mongoString)
  .then((res) => console.log("Database Connected"))
  .catch((err) => console.log(err));


//Routes
app.use("/api", userRoutes);
app.use('/api/auth',authRoutes);
// app.use('/api/post',postRoutes);

//Server Setup
app.listen(process.env.PORT, () => {
  console.log(`Server is Listening on port:${process.env.PORT}`);
});
