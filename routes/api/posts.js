const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const { validationResult, check } = require('express-validator');

const User = require('../../models/User');
const Post = require('../../models/Post');


// @route   POST api/posts
// @desc    Add/Create a Post
// @access  Private
router.post('/', auth, 
    check('text', 'Text is required').not().isEmpty()
, async (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
    }

    try {

        let user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            user: req.user.id,
            avatar: user.avatar
        });

        const post = await newPost.save();

        res.json(post);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/posts
// @desc    Get all Posts
// @access  Private
router.get('/', auth, async (req, res) => {

    try {
        let posts = await Post.find().sort({ date: -1 });

        res.json(posts);

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/posts/:id
// @desc    Get Post by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {

    try {
        let posts = await Post.findById(req.params.id);

        if(!posts) {
            return res.status(404).json({ msg: 'No Posts found'});
        }

        res.json(posts);

    } catch (error) {
        console.log(error.message);
        if(error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'No Posts found'});
        }
        res.status(500).send('Server error');
    }
});


// @route   DELETE api/posts/:id
// @desc    Delete post by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(400).json({ msg: 'No Posts found'});
        }

        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized'});
        }

        await post.remove();
        res.json({ msg: 'Post successfully deleted'});

    } catch (error) {
        console.log(error.message);
        if(error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'No Posts found'});
        }
        res.status(500).send('Server error');
    }
});


// @route   PUT api/posts/likes/:id
// @desc    Like a Post
// @access  Private
router.put('/likes/:id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post has already been liked'});
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();
        res.json(post.likes);

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a Post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        // Check if the post has been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not bee liked yet'});
        }

        const removeIndex = post.likes.map(like => like.user).indexOf(req.params.id);

        post.likes.splice(removeIndex, 1);

        await post.save();
        res.json(post.likes);

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;