const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const fetchUsers = async (req, res) => {
  try {
      const users = await User.find()
      res.json({
          status: 'SUCCESS',
          data: users
      });
  } catch (error) {
      res.json({
          status: 'FAILED',
          message: 'Something went wrong'
      })
  }
}

const signUp = async (req, res) => {
  try {
      const { name, email, password, isAdmin } = req.body;
      const encryptedPassword = await bcrypt.hash(password, 10)
      await User.create({ name, email, password: encryptedPassword, isAdmin })
      res.json({
          status: 'SUCCESS',
          message: `${name} signed up successfully`
      });
  } catch (error) {
      res.json({
          status: 'FAILED',
          message: 'Something went wrong'
      })
  }
}

const logIn = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email })
    
      if(!user) {
        return res.json({
            status: 'FAILED',
            message: 'Invalid credentials'
        });
      }

      const doesPasswordMatch = await bcrypt.compare(password, user.password)

      if(!doesPasswordMatch) {
        return res.json({
          status: 'FAILED',
          message: 'Invalid credentials'
        });
      }

      const jwToken = jwt.sign(user.toJSON(), process.env.JWT_PRIVATE_KEY, { expiresIn: 15 })

      res.json({
        status: 'SUCCESS',
        message: `${user.name} logged in successfully`,
        token: jwToken
      });
  } catch (error) {
      res.json({
          status: 'FAILED',
          message: 'Something went wrong'
      })
  }
}

module.exports = {
  fetchUsers,
  signUp,
  logIn
}