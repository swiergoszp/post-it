// ****************************************************************************************************************************
// DEPENDANCIES
// ****************************************************************************************************************************

// Express router set up
const express = require('express');
const router = express.Router();

// model imports
const Post = require('../models/post');

// multer set-up for file handling
const multer = require('multer');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// AuthCheck Middleware
const authCheck = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid MIME_TYPE');
    if (isValid) {
      error = null
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

// ****************************************************************************************************************************
// ROUTES
// ****************************************************************************************************************************

// post route adds new posts to db
router.post('', authCheck, multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(result => {
    res.status(201).json({
      message: 'Post Added!',
      post: {
        id: result._id,
        title: result.title,
        body: result.body,
        imagePath: result.imagePath,
      }
    });
  });
});

//updates posts
router.put('/:id', authCheck, multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    body: req.body.body,
    imagePath: imagePath
  });
  Post.updateOne({ _id: req.params.id }, post)
    .then((result) => {
      res.status(200).json({
        message: 'Update Successful!'
      });
    });
});

// grabs posts from db
router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery.then((docs) => {
    fetchedPosts = docs;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: 'Posts successfully retrieved',
      posts: fetchedPosts,
      maxPosts: count
    });
  });
});

// finds a post by id
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found.'
      });
    }
  });
});

// deletes post
router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Post deleted.',
      });
    })
});

module.exports = router;
