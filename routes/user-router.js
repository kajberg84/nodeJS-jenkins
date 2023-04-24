/**
 * User Router.
 *
 * @author Kaj Berg
 * @version 0.1.0
 */

 import express from 'express'
 import { UserController } from '../controllers/user-controller.js'
 import { authAccessToken, hasPermission } from '../utilities/jwthandler.js'
export const userRouter = express.Router()

const controller = new UserController()
const PermissionLevels = Object.freeze({
  CHILD: 1,
  GUEST: 2,
  OWNER: 4,
  ADMIN: 8
})

// provide req.user to the route if :id is present in the route path
userRouter.param('id', (req, res, next, id) => controller.loadUser(req, res, next, id))

// POST create user
userRouter.post('/', (req, res, next) => controller.create(req, res, next))

// Get user
userRouter.get('/', (req, res, next) => controller.getUser(req, res, next))

// Delete user 
userRouter.delete('/:id', 
  authAccessToken,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.OWNER),
  (req, res, next) => controller.delete(req, res, next)
)

//ADMIN GET ALL USERS
userRouter.get('/getall', 
  authAccessToken,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.ADMIN),
  (req, res, next) => controller.getAllUsers(req, res, next)
)

// Get user by id
userRouter.get('/:id', (req, res, next) => controller.getById(req, res, next))
