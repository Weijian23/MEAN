// bGGe4K8d0sUxiha3

const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose", { useUnifiedTopology: true });
const path = require("path");

const postRoutes = require('./routes/posts');
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect("mongodb+srv://weijian:bGGe4K8d0sUxiha3@mean2020-lnydh.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to database.")
  })
  .catch((error) => {
    // console.log(error);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-control-Allow-Methods", "GET, POST, PATCH, OPTIONS, DELETE, PUT");
  next();
})

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
