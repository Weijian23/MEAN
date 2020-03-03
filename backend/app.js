const express = require('express');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  next();
})

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post added successfully"
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: "efdsfadsagfdgdf",
      title: "First server-side post",
      content: "This is coming from server"
    },
    {
      id: "fuoiwejgongmn",
      title: "Second server-side post",
      content: "This is coming from server again"
    }
  ];
  res.status(200).json({
    message: "Test message from response",
    posts: posts
  })
});

module.exports = app;
