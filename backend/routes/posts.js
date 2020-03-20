const express = require("express");
const Post = require('../models/post');
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");
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

router.post(
  "",
  checkAuth,
  multer({ storage: multerStorageConfig }).single("image"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
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
      })
      .catch(error => {
        res.status(500).json({
          message: "Creating new post failed."
        })
      });
  });

router.get('', (req, res, next) => {
  // console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      // console.log(documents);
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Data fetched successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed."
      })
    });
});

router.put(
  '/:id',
  checkAuth,
  multer({ storage: multerStorageConfig }).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    // console.log(post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then((result) => {
        // console.log("edit post: " + result);
        if (result.nModified > 0) {
          res.status(200).json({ message: 'Update successful.' });
        }
        else {
          res.status(401).json({ message: "Not Authorized." });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Couldn't update post."
        })
      });
  });

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'post not found.' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed."
      })
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      // console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Post deleted." });
      }
      else {
        res.status(401).json({ message: "Not Authorized." });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed."
      })
    });
});

module.exports = router;
