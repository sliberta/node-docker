const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const newPassword = await bcrypt.hash(password, 12);
    const user = await User.create({username, password: newPassword});
    // Save user info into the session
    req.session.user = user;
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Unable to create user.',
      error: e
    })
  }
}

exports.login = async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User was not found.'
      })
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      // Save user info into the session
      req.session.user = user;
      res.status(200).json({
        status: 'success'
      });

    } else {
      res.status(401).json({
        status: 'fail',
        message: 'Un authorized user.'
      })
    }
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Unable to create user.',
      error: e
    })
  }
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      result: users.length,
      data: {
        users
      }
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Unable to fetch users.'
    })
  }
}

exports.getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Unable to fetch users.'
    })
  }
}
