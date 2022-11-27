const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

// 1. register controller
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  
  // name or password or email이 존재하지 않을 때
  if (!name || !password || !email) {
    throw new BadRequestError('Please provide name, email and password.');
  }

  res.status(StatusCodes.CREATED).json({
    user: { name: user.name },
    token
  });
};

// 2. login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // password or email이 존재하지 않을 때
  if (!email || !password) {
    throw new BadRequestError('Please provide email, password.');
  }

  // user 찾기
  if (!user) {
    throw new UnauthenticatedError('Invald user Credentials');
  }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invald password Credentials');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name
    }, token
  });
};

module.exports = { register, login };