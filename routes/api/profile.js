const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport')
//Load Profile model
const profile = require('../../models/profile')
    //Load User model
const user = require('../../models/User')
//Load ValidationProfileInput
const validateProfileInput = require('../../validation/profile');
const validateExpInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')
//@route  GET api/profile/test
//@desc   Test profile route
//@access Public
router.get('/test', (req, res) => res.json({
    msg: "Profiles Works"
}));
//@route  GET api/profile/
//@desc   Get current users profile
//@access Private
router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const errors = {};
    profile.findOne({
            user: req.user.id
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors)
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json(err))
})
//@route  GET api/profile/handle/:handle
//@desc   GET profile by handle
//@access Public
router.get('/handle/:handle', (req, res) => {
    const errors = {}
    profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user'
                res.status(400).json(errors)
            }
            res.json(profile)
        }).catch(err => res.status(404).json(err))
})
//@route  GET api/profile/user/:user_id
//@desc   GET profile by user ID
//@access Public
router.get('/user/:user_id', (req, res) => {
    const errors = {}
    profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user'
                return res.status(400).json(errors)
            }
            res.json(profile)
        }).catch(err => res.status(404).json({ profile: 'There is no profile this user' }))
})
//@route  GET api/profile/all
//@desc   GET all profile
//@access Public
router.get('/all', (req, res) => {
    const errors = {}
    profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user'
                return res.status(404).json(errors)
            }
            res.json(profile)
        }).catch(err => res.status(404).json({ profile: 'There is no profile this user' }))
})
//@route  POST api/profile/
//@desc   Create or edit user profile
//@access Private
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateProfileInput(req.body);
    //Check Validation
    if (!isValid) {
        //Return any error with 400 status
        return res.status(400).json(errors)
    }
    //Get fields
    const profileFields = {}
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle
    if (req.body.company) profileFields.company = req.body.company
    if (req.body.website) profileFields.website = req.body.website
    if (req.body.location) profileFields.location = req.body.location
    if (req.body.bio) profileFields.bio = req.body.bio
    if (req.body.status) profileFields.status = req.body.status
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername
        //skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',')
    }
    //Social 
    profileFields.social = {}
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram
    profile.findOne({
            user: req.user.id
        })
        .then(_profile => {
            if (_profile) {
                //Update 
                profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                }).then(_profile => res.json(_profile))
            } else {
                //Create
                //Check if handle exists
                profile.findOne({
                    handle: profileFields.handle
                }).then(_profile => {
                    if (_profile) {
                        errors.handle = 'That handle already exists'
                        res.status(400).json(errors)
                    }
                    //Save Profile
                    new profile(profileFields).save().then(profile => res.json(profile))
                })
            }
        })
})

//@route  POST api/profile/experience
//@desc   Add experience to profile
//@access private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const {errors,isValid} = validateExpInput(req.body);
    //Check Validation
    if (!isValid) {
        //Return any error with 400 status
        return res.status(400).json(errors)
    }
    profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                    title: req.body.title,
                    company: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                }
                //Add to experience array
            profile.experience.unshift(newExp);
            profile.save().then(new_profile => res.json(new_profile))
        })
})

//@route  POST api/profile/education
//@desc   Add education to profile
//@access private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const {errors,isValid} = validateEducationInput(req.body);

    //Check Validation
    if (!isValid) {
        //Return any error with 400 status
        return res.status(400).json(errors)
    }
    profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                    school: req.body.school,
                    degree: req.body.degree,
                    fieldofstudy: req.body.fieldofstudy,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                }
                //Add to experience array
            profile.education.unshift(newEdu);
            profile.save().then(new_profile => res.json(new_profile))
        })
})
//@route  DELETE api/profile/experience/:exp_id
//@desc   Delete experience from profile
//@access private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    profile.findOne({ user: req.user.id }).then(profile=>{
      //GET remove index
      const removeIndex = profile.experience
      .map(item=>item.id)
      .indexOf(req.params.exp_id);
      //Spilt out of array
      profile.experience.splice(removeIndex,1);
      //Save
      profile.save().then(profile=>res.json(profile))
    }).catch(err=>res.status(404).json(err));
 
})
//@route  DELETE api/profile/education/:edu_id
//@desc   Delete education from profile
//@access private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    profile.findOne({ user: req.user.id }).then(profile=>{
      const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.edu_id)
      profile.education.splice(removeIndex,1);
      profile.save().then(profile=>res.json(profile))
    }).catch(err=>res.status(404).json(err))   
})
//@route  DELETE api/profile/
//@desc   Delete user and profile
//@access private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  profile.findOneAndRemove({user:req.user.id})
  .then(()=>{
    user.findOneAndRemove({_id:req.user.id})
    .then(()=>res.json({success:true}))
  })
})

module.exports = router;