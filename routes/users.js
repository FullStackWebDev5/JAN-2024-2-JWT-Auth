const express = require('express');
const router = express.Router()

const {
  fetchUsers,
  signUp,
  logIn,
} = require('../controllers/users')

router.get('/api/users', fetchUsers);

router.post('/api/signup', signUp);

router.post('/api/login', logIn);

module.exports = router;