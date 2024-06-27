import User from '../models/User.js'
import asyncHandler from '../middlewares/asyncHandler.js'
import bcrypt from 'bcryptjs'

import createToken from '../utils/createToken.js'

const createUser = asyncHandler(async, (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    throw new Error("Please fill all the fields.")
  }

  const userExist = await User.findOne({ email })
  if (userExist) res.status(400).send("User already exist.")

  //hash pass

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const newUser = new User({ username, email, password: hashedPassword })

  try {
    await newUser.save()
    createToken(res, newUser._id)
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    })

  } catch (error) {
    res.status(400)
    throw new Error("invalid user data.")
  }

})

const loginUser = asyncHandler(async, (req, res) => {
  const { email, password } = req.body;
  existingUser = await User.findOne({ email })

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(password, existingUser.password)

    if (isPasswordValid) {
      createToken(res, existingUser._id)

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      })

    } else {
      res.status(401).json({ message: "invalid password" })
    }


  } else {
    res.status(401).json({ message: "invalid user not found" })

  }

})

const logoutCurrentUser = asyncHandler(async, (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: "logged out!" })
})

const getAllUsers = asyncHandler(async, (req, res) => {
  const users = await User.find({})
  res.status(200).json(users)
})

const getCurrentUserProfile = asyncHandler(async, (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    })
  } else {
    res.status(404)
    throw new Error("user not found.")
  }
})

const updateCurrentUserProfile = asyncHandler(async, (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.username = req.body.username || user.username
    user.email = req.body.email || user.email

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      user.password = hashedPassword
    }

    const updatedUser = await user.save()
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })

  }else{
    res.status(404)
    throw new Error("user not found")
  }

})

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
}