/**
 * Module for the Token Controller.
 *
 * @author Kaj Berg
 * @version 0.1.0
 */

 import jwt from 'jsonwebtoken'

 /**
  * Encapsulates a controller.
  */
 export class TokenController {
 
 /**
 * Returning token and user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
 async refreshToken (req, res, next) {
 try {
     const payload = { ...req.user };

     // Creating a new accesstoken
     const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
       algorithm: "HS256",
       expiresIn: process.env.ACCESS_TOKEN_LIFE,
     });

     // Creating a new refreshtoken
     const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
       algorithm: "HS256",
       expiresIn: process.env.REFRESH_TOKEN_LIFE,
     });

     res.status(200).json({
       access_token: accessToken,
       refresh_token: refreshToken,
     });
   } catch (error) {
   console.log('error i refreshtoken')
   next(error)
 }
 }
 }
 