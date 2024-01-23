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




const mongodbURI = process.env.MONGODB_URI || 'mongodb://harshJaiswal:Harsh18719@cluster0.ip4h7xa.mongodb.net/?retryWrites=true&w=majority';
const port = process.env.PORT || 3000;

//Connecting to Database Here
mongoose.connect(mongodbURI,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {console.log("Database Connected")})
.catch((err) => console.log(err));


//Routes
app.use("/api", userRoutes);
app.use('/api',authRoutes);
app.use('/api',postRoutes);


//Server Setup
app.listen(port, () => {
  console.log(`Server is Listening on port:${port}`);
});
