require("dotenv").config();
const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const mongoose = require("mongoose");
const quesRouter = require("./routes/ques");
mongoose.connect(
  "mongodb+srv://soumadipdas18:soumadipdas18@cluster0.y9xbl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connection to db established"));
app.use(express.json());
app.use(cors());
app.use(express.static("uploaded_imgs"));
app.use(fileUpload());
app.use("/ques", quesRouter);
app.listen(process.env.PORT||9000, () =>
  console.log(`server has started at port ${process.env.PORT||9000}`)
);
