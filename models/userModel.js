const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
  
//     // Hash the password
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   });
  

// Method to compare password during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password); // Compare plain-text password with hashed password
};

const User = mongoose.model('User', userSchema);

module.exports = User;