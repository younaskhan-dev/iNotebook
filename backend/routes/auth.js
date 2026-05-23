const express = require('express');
const User = require('../models/User');
const upload = require('../middleware/upload');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'inotebook_local_secret';
const fetchuser = require('../middleware/fetchuser');

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not defined. Using a local fallback secret. Set JWT_SECRET in your .env for production.');
}

// Rate limiting middleware
const createUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many signup attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Route 1: create a user using post "/api/auth/createUser". no login required
router.post('/createUser', createUserLimiter, [
  body('name', 'Name must be at least 3 characters long').isLength({ min: 3 }),
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
  let success = false
  // if there are error return bad request and the error
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ success, error: error.array() });
  }

  try {
    // check whether the user with this email exists already
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ success, error: 'This email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secpass
    });
    console.log(`New user created: ${user.email} (id: ${user._id})`);
    const data = {
      user: {
        id: user.id
      }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ success, error: 'This email is already registered' });
    }
    res.status(500).json({ success, error: 'Internal server error' });
  }
})
//Route 2: create a user login using post "/api/auth/login"
router.post('/login', loginLimiter, [
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password can not be blank').exists(),
], async (req, res) => {
  let success = false
  // if there are error return bad request and the error
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ success, error: error.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email })
    if (!user) {
      success = false
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const passwordcompare = await bcrypt.compare(password, user.password)
    if (!passwordcompare) {
      success = false
      return res.status(400).json({ success, error: 'Invalid credentials' });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: 'internal server error' });
  }
})
//Route 3: Get logged in User details: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).select("-password");
    res.send(user)

  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: 'internal server error' });
  }
})

// Route 4: Update user details: PUT "/api/auth/updateuser". Login required
router.put('/updateuser', fetchuser, [
  body('name', 'Name must be at least 3 characters long').isLength({ min: 3 }),
  body('email', 'Invalid email format').isEmail(),
], async (req, res) => {
  try {
    const { name, email, profileImage } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const newUser = {};
    if (name) newUser.name = name;
    if (email) newUser.email = email;
    if (profileImage !== undefined) newUser.profileImage = profileImage;

    // Check if email is already taken by another user
    if (email) {
      let existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ success: false, error: "This email is already registered" });
      }
    }

    // Find the user to be updated and update it
    let user = await User.findById(req.user.id);
    if (!user) { return res.status(404).json({ success: false, error: "User Not Found" }) }

    user = await User.findByIdAndUpdate(req.user.id, { $set: newUser }, { new: true });
    res.json({ success: true, user });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
// Route 5: Upload profile image
const uploadProfileImageHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const imageUrl = req.file.path || req.file.secure_url || req.file.url;
    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Unable to resolve uploaded image URL' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: imageUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      profileImage: imageUrl,
      user
    });
  } catch (error) {
    console.error('Profile upload failed:', error.message, error.stack);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

router.post('/uploadprofileimage', fetchuser, upload.single('profileImage'), uploadProfileImageHandler);
router.put('/uploadprofileimage', fetchuser, upload.single('profileImage'), uploadProfileImageHandler);
module.exports = router;