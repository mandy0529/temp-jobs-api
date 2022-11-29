const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email'
    ],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6
  }
});

// password hash middleware
UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// generate token middleware
UserSchema.methods.createJWT = function() {
  return jwt.sign({
    userId: this._id,
    name: this.name
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME
  });
};

// compare password
UserSchema.methods.comparePassword = async function(currentPassword) {
  const isMatch = await bcrypt.compare(currentPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);