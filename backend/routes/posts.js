const express = require("express");
const Post = require('../models/post');
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const multerStorageConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let fileError = new Error("Invalid file type");
    if (isValid) {
      fileError = null;
    }
    callback(fileError, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('_');
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "_" + Date.now() + '.' + extension);
  }
});

router.post("", multer({ storage: multerStorageConfig }).single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save()
    .then((createdpost) => {
      res.status(201).json({
        message: "Post added successfully",
        // postId: createdpost._id
        post: {
          id: createdpost._id,
          title: createdpost.title,
          content: createdpost.content,
          imagePath: createdpost.imagePath
        }
      });
    });

});

router.get('', (req, res, next) => {
  Post.find()
    .then(documents => {
      // console.log(documents);
      res.status(200).json({
        message: "Data fetched successfully",
        posts: documents
      });
    });
});

router.put('/:id', multer({ storage: multerStorageConfig }).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({ _id: req.params.id }, post)
    .then((result) => {
      // console.log("edit post: " + result);
      res.status(200).json({ message: 'update successful.' });
    })
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'post not found.' });
      }
    });
});

router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id })
    .then((result) => {
      // console.log(result);
      res.status(200).json({ message: "Post deleted." });
    });
});

module.exports = router;
