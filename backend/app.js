// ixFgz3vVCx8ScR2o

const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose", { useUnifiedTopology: true });

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://weijian:ixFgz3vVCx8ScR2o@mean2020-lnydh.mongodb.net/angular-node-test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to database.")
  })
  .catch(() => {

  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-control-Allow-Methods", "GET, POST, PATCH, OPTIONS, DELETE");
  next();
})

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save()
    .then((createdpost) => {
      res.status(201).json({
        message: "Post added successfully",
        postId: createdpost._id
      });
    });

});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({
        message: "Data fetched successfully",
        posts: documents
      });
    });

});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Post deleted." });
    });
});

module.exports = app;
