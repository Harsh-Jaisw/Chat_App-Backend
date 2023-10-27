require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

//Importing Routes Here

const userRoutes = require("./routes/user");
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');




//Middleware's Here
app.use('/public/uploads', express.static('public/uploads'));
app.use(cors());
app.use(express.json());




const mongoString =
  process.env.NODE_ENV === "development"
    ? "mongodb://localhost:27017/ChatApp"
    : process.env.DATABASE_URL;

//Connecting to Database Here
mongoose
  .connect(mongoString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(async () => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(err));


//Routes
app.use("/api", userRoutes);
app.use('/api',authRoutes);
app.use('/api',postRoutes);


//Server Setup
app.listen(process.env.PORT, () => {
  console.log(`Server is Listening on port:${process.env.PORT}`);
});
