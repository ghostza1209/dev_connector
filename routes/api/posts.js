const express = require('express');
const router = express.Router();
const passport = require('passport');

const Post = require('../../models/post')
const Profile = require('../../models/profile')
//validation 
const validationPostInput = require('../../validation/post');

//@route  GET api/posts/test
//@desc   Test post route
//@access Public
router.get('/test', (req, res) => res.json({
  msg: "Posts Works"
}));
//@route  GET api/posts/
//@desc   get posts
//@access Public
router.get('/', (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(posts => {
      res.json(posts)
    })
    .catch(err => res.status(404).json({
      nopostfound: 'No posts found  with this ID'
    }))
})
//@route  GET api/posts/:post_id
//@desc   get posts by id
//@access Public
router.get('/:post_id', (req, res) => {
  Post.findById(req.params.post_id)
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({
      nopostfound: 'No post found  with this ID'
    }))
})

//@route  POST api/posts
//@desc   Create post
//@access private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validationPostInput(req.body);
  if (!isValid) return res.status(400).json(errors)
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });
  newPost.save().then(newPost => res.json(newPost))
})
//@route  DELETE api/posts/:post_id
//@desc   DELETE posts by ID
//@access Private
router.delete('/:post_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.post_id)
        .then(post => {
          //Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              notauthorized: 'User not authorized'
            })
          }
          //Delete 
          post.remove().then(() => res.json({
            success: true
          })).catch(err => res.status(404).json({
            postnotfound: 'No post found'
          }))
        })
    })
})

//@route  POST api/posts/like/:id
//@desc   Like post
//@access Private
router.post('/like/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({
              alreadyliked: 'User already liked this post'
            })
          }
          //Add Use Id to likes Array[]
          post.likes.unshift({
            user: req.user.id
          });
          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({
          postnotfound: 'No post found'
        }))
    })
})

//@route  POST api/posts/unlike/:id
//@desc   Unlike post
//@access Private
router.post('/unlike/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({
              alreadyliked: 'You have not yet liked this post'
            })
          }
          //get remove Index
          const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id)
          //Splice out of array
          post.likes.splice(removeIndex, 1);
          //Save 
          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({
          postnotfound: 'No post found'
        }))
    })
})
//@route  POST api/posts/comment/:post_id
//@desc   Add comment to post
//@access Private
router.post('/comment/:post_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validationPostInput(req.body);
  if (!isValid) return res.status(400).json(errors)

  Post.findById(req.params.post_id).then(post => {
    const newComment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    }
    //Add to comment []
    post.comments.unshift(newComment)
    //Save
    post.save().then(post => res.json(post))
  }).catch(err => res.status(404).json({
    postnotfound: 'post not found',
    err
  }))
})


//@route  DELETE api/posts/comment/:post_id/:comment_id
//@desc   Remove comment from post
//@access Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Post.findById(req.params.post_id).then(post => {
    // Check to see if comment exists
    if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
      return res.status(404).json({
        commentnotexists: 'Comment does not exists'
      })
    }
    //Get remove Index
    const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
    //Splice comment out of array
    post.comments.splice(removeIndex, 1);
    post.save().then(post => res.json(post))
  }).catch(err => res.status(404).json({
    postnotfound: 'post not found'
  }))
})


module.exports = router;