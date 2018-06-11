const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Load Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Testing post get route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'posts works!' }));

// @route   POST api/posts
// @desc    Create Post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // validation
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // create post from req.body
    const { text, name, avatar } = req.body;
    const newPost = new Post({
      text,
      name,
      avatar,
      user: req.user.id
    });

    // save post and return json
    newPost.save().then(post => res.json(post));
  }
);

// @route   GET api/posts
// @desc    Get posts index page
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        // Check if current user owns post
        if (post.user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ notauthorized: 'You are not authorized for that!' });
        }

        // Remove post
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err =>
            res.status(404).json({ postnotfound: 'Post not found' })
          );
      });
    });
  }
);

module.exports = router;
