const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Your user model
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        const user = await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send token in cookie and return success message
        res.cookie('token', token, { httpOnly: true, secure: false });
        res.status(200).json({ message: 'Signed Up  successfully' ,
                             data : token
                             });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Log to check the user fetched
      console.log('User Found: ', user);
  
      // Compare the password with the hashed password stored in the database
      const isMatch = await user.comparePassword(password);
      
      // Log result of password comparison
      console.log('Passwords Match: ', isMatch);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Create JWT token if credentials are valid
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
  
      // Respond with the token
      res.cookie('token', token, { httpOnly: true, secure: false });
      res.status(200).json({ message: 'Logged in successfully',
                           data : token
                           });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/logout', (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', { httpOnly: true, secure: false });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
