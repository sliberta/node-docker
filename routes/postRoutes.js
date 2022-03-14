const express = require('express');
const postController = require('../controllers/postController');
const protect = require('../middleware/middleware');

const router = express.Router();

router
  .route('/')
  .get(postController.getAllPosts)
  .post(protect, postController.createPost);

router
  .route('/:id')
  .get(postController.getOnePost)
  .patch(postController.postUpdate)
  .delete(postController.postDelete);

module.exports = router;
