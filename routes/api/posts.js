const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Model
const Post = require('../../models/Post');

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

module.exports = router;
