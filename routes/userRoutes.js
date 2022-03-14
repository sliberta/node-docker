const express = require('express');
const userController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)

router
  .route('/signup')
  .post(userController.signUp);

  router
  .route('/login')
  .post(userController.login);

router
  .route('/:id')
  .get(userController.getOneUser);

module.exports = router;
