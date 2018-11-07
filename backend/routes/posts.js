// ****************************************************************************************************************************
// DEPENDANCIES
// ****************************************************************************************************************************

// Express router set up
const express = require('express');

const router = express.Router();

// Controller
const PostController = require('../controllers/posts');

// Middleware
const authCheck = require('../middleware/check-auth');

const extractFile = require('../middleware/file');


// ****************************************************************************************************************************
// ROUTES
// ****************************************************************************************************************************

// post route adds new posts to db
router.post('', authCheck, extractFile, PostController.createPost);

//updates post
router.put('/:id', authCheck, extractFile, PostController.updatePost);

// grabs posts from db
router.get('', PostController.getPosts);

// finds a post by id
router.get('/:id', PostController.getPost);

// deletes post
router.delete('/:id', PostController.deletePost);

module.exports = router;
