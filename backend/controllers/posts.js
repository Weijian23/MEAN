const Post = require('../models/post');


exports.createPost = (req, res, next) => {
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
}

exports.updatePost = (req, res, next) => {
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
      // console.log(result);
      if (result.n > 0) {
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
}

exports.getPosts = (req, res, next) => {
  // console.log(req);
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
      // return Post.count();
      return Post.countDocuments();
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
}

exports.getPostsByCreator = (req, res, next) => {
  // console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userId = req.query.userId;
  // console.log(typeof userId);
  if (userId == '' || userId == 'undefined') {
    console.log("pass");
    return;
  }
  // console.log("--------------", userId);
  const postQuery = Post.find({ creator: userId });
  console.log("query--------- ", postQuery);
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      console.log("22222  ", documents);
      fetchedPosts = documents;
      return Post.count({ creator: userId });
    })
    .then(count => {
      res.status(200).json({
        message: "Data fetched successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      // console.log(error);
      res.status(500).json({
        message: "Fetching posts failed."
      })
    });
}


exports.getPost = (req, res, next) => {
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
}

exports.deletePost = (req, res, next) => {
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
}
