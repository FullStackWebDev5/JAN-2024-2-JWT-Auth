const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const userRoutes = require('./routes/users')
const jwt = require('jsonwebtoken')

const app = express();

// Authentication
const isUserLoggedIn = (req, res, next) => {
  try {
    const { token } = req.headers
    const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    req.user = user
    next()
  } catch (error) {
    return res.json({
      status: 'FAILED',
      message: "You've not logged in! Please login"
    });
  }
}

// Authorization
const isUserAdmin = (req, res, next) => {
  const isAdmin = req.user.isAdmin
  if(isAdmin) {
    next()
  } else {
    return res.json({
      status: 'FAILED',
      message: "You're not authorized to access this page"
    });
  }
}

app.use(cors());
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
// app.use(isUserLoggedIn) // Applies to all routes
app.use(userRoutes)

app.get('/', (req, res) => {
  res.send({
    status: 'Server is up :)',
    now: new Date()
  });
});

app.get('/dashboard', (req, res) => {
  res.send('Welcome to Dashboard');
});

// Private
app.get('/movies', isUserLoggedIn, (req, res) => {
  res.send('Welcome to Movies');
})

app.get('/admin', isUserLoggedIn, isUserAdmin, (req, res) => {
  res.send('Welcome to Admin Dashboard');
})

app.listen(process.env.PORT, () => {
    mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log('Server is running :)'))
      .catch((error) => console.log(error));
});




























/*
  # Authentication & Authorization 
    - Authentication: Identity of the user (Who are you?)
    - Authorization: Understanding user's access (What access do you have?)
  
  # Encryption/ Decrytion
    - Encryption formula: N+3
    - Decryption formula: N-3
    - Original Password: Anand246
    - Encrypted Password: Dqdqg579
    - Decrypted Password: Anand246

  # Middlewares

  # Packages
    - bcrypt
    - jsonwebtoken
*/