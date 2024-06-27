import express from 'express'

//controllers
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,

} from '../controllers/userController.js'


//middlewares
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js'


const router = express.Router()

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers)

router.post('/auth', loginUser)

router.post('/logout', logoutCurrentUser)

router
  .get('/profile', authenticate, getCurrentUserProfile)
  .put('/profile', authenticate, updateCurrentUserProfile)


// router.put('/update', updateUser)

// router.delete('/delete', deleteUser)


export default router;