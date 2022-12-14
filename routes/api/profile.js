const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const { validationResult, check } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');


// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.user.id
      }).populate('user', ['name', 'avatar']);
  
      if (!profile) {
        return res.status(400).json({ msg: 'There is no profile for this user' });
      }
  
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


// @route   Get api/profile
// @desc    Create or Update Profile
// @access  Private
router.post('/', auth, 
    check('status', "Status is required").not().isEmpty(),
    check('skills', "Skills is required").not().isEmpty()
 ,async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
      } = req.body;

    //   Build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //   Build social object
     profileFields.social = {};
     if(youtube) profileFields.social.youtube = youtube;
     if(twitter) profileFields.social.twitter = twitter;
     if(instagram) profileFields.social.instagram = instagram;
     if(linkedin) profileFields.social.linkedin = linkedin;
     if(facebook) profileFields.social.facebook = facebook;


    try {
        
        let profile = await Profile.findOne({ user : req.user.id });

        // Update if User Exists
        if(profile) {
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields}, {new: true});

            return res.json(profile);
        }

        // If NEW, Create New User

        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error!');
    }
});


// @route   Get api/profile
// @desc    Get all Profiles
// @access  public
router.get('/', async (req, res) => {
    try {
        let profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error.')
        
    }
});

// @route   Get api/profile/user/:user_id
// @desc    Get Profile by Id
// @access  public
router.get('/user/:user_id', async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if(!profile) {
            return res.status(400).json({ msg: 'Profile not found.' });
        }

         return res.json(profile); 
    } catch (error) {
        console.log(error.message);
        if(error.kind == "ObjectId") {
            return res.status(400).json({ msg: 'Profile not found.' });
        }
        res.status(500).send('Server Error.')
        
    }
});


// @route   Delete api/profile
// @desc    Delete user, profile and posts
// @access  private
router.delete('/', auth, async (req, res) => {
    try {
        // remove posts
        await Post.deleteMany({ user: req.user.id });

        // Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Remove User
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: `User has been Deleted. `}); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error.')
    }
});


// @route   PUT api/profile/experience
// @desc    Update User Experience
// @access  private
router.put('/experience', [ auth, [
    check('title', 'Title is required.').not().isEmpty(),
    check('company', 'Company is required.').not().isEmpty(),
    check('from', 'From date is required.').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    const {title,
        company, 
        location, 
        from, 
        to, 
        current, 
        description
    } = req.body;

    const newExperience = {
        title,
        company, 
        location, 
        from, 
        to, 
        current, 
        description
    }

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        profile.experience.unshift(newExperience);

        await profile.save();

        res.json(profile);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server error');
        
    }
});


// @route   Delete api/profile/experience/:exp_id
// @desc    Delete experience by id
// @access  private
router.delete('/experience/:exp_id', auth, async(req, res) => {

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        // Remove by index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error.');
        
    }
});

// @route   PUT api/profile/education
// @desc    Create or Update Education
// @access  private
router.put('/education', [auth, 
    check('school', 'School name is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
], 
    async(req, res) => {

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {school, 
                degree, 
                fieldofstudy, 
                from,
                to, 
                current, 
                description} = req.body;


        const newEducation = {
                school, 
                degree, 
                fieldofstudy, 
                from,
                to, 
                current, 
                description
        };

        try {

            let profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEducation);

            await profile.save();
            res.json(profile);
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
});


// @route   Delete api/profile/experience/:edu_id
// @desc    Delete education by id
// @access  private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id });

        // Remove education by index
        const removeIndex = profile.education.map(edu => edu.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');   
    }
});

// @route   Get api/profile/github/:username
// @desc    Get Users github repos
// @access  public
router.get('/github/:username', async (req, res) => {
    try {

        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}
            &client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers : { 'user-agent' : 'node.js' }
        }

        request(options, (error, response, body) => {
            if(error) console.log(error);

            if(response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }

            res.json(JSON.parse(body));
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
        
    }
})


module.exports = router;