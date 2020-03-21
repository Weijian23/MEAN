const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file-multer");
const router = express.Router();

const Postcontroller = require("../controllers/posts");



router.post(
  "",
  checkAuth,
  extractFile, Postcontroller.createPost);

router.put(
  '/:id',
  checkAuth,
  extractFile, Postcontroller.updatePost);

// router.get('', Postcontroller.getPostsByCreator);
router.get('', Postcontroller.getPosts);

router.get('/:id', Postcontroller.getPost);

router.delete("/:id", checkAuth, Postcontroller.deletePost);

module.exports = router;
