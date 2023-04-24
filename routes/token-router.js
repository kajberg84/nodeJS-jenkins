/**
 * Login Router.
 *
 * @author Kaj Berg
 * @version 0.1.0
 */

 import express from 'express'
 import { TokenController } from '../controllers/token-controller.js'
 import { hasPermission } from '../utilities/jwthandler.js'
 import { authRefreshToken } from '../utilities/refreshTokenHandler.js'
 
 const PermissionLevels = Object.freeze({
 CHILD: 1,
 GUEST: 2,
 OWNER: 4,
 ADMIN: 8
 })
 
 export const tokenRouter = express.Router()
 const controller = new TokenController()
 
 // Post event
 tokenRouter.post('/', 
 authRefreshToken,
   (req, res, next) => hasPermission(req, res, next, PermissionLevels.OWNER),
   (req, res, next) => controller.refreshToken(req, res, next)
 )
 