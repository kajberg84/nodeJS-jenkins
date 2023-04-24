/**
 * Login Router.
 *
 * @author Kaj Berg
 * @version 0.1.0
 */

 import express from 'express'
 import { LoginController } from '../controllers/login-controller.js'
 
 export const loginRouter = express.Router()
 const controller = new LoginController()
 
 // POST Login user
 loginRouter.post('/', (req, res, next) => controller.login(req, res, next))