const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { Error } = require('mongoose');

module.exports = {
  createUser: async ({ userInput }, request) => {
    const existingUser = await User.findOne({ email: userInput.email });
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'Email is invalid' });
    }

    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short' });
    }

    if (errors.length) {
      const error = new Error('Invalid input');
      error.data = errors;
      error.code = 442;
      throw error;
    }

    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPassword
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  }
};
