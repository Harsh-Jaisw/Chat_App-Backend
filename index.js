require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/user");
const cors = require("cors");
const mongoString = process.env.DATABASE_URL;

mongoose
  .connect(mongoString)
  .then((res) => console.log("Database Connected"))
  .catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is Listening on port:${process.env.PORT}`);
});
