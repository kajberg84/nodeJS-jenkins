/**
 * Module for the Login Controller.
 *
 * @author Kaj Berg
 * @version 0.1.0
 */
 import UserModel from '../models/usermodel.js'
 import { createToken } from '../utilities/jwthandler.js';
 import { checkUserPassword } from '../utilities/passwordHandler.js'
 import {saveRefToken } from '../utilities/refreshTokenHandler.js'
 import createError from "http-errors";


 /**
  * Encapsulates a controller.
  */
 export class LoginController {
   /**
    * Authenticates a user.
    *
    * @param {object} req - Express request object.
    * @param {object} res - Express response object.
    * @param {Function} next - Express next middleware function.
    */
   async login(req, res, next) {
     console.log(req.query.email, " is trying to log in");
     try {
       const user = await UserModel.findOne({ email: req.query.email });
       const checkPassword = await checkUserPassword(
         req.query.password,
         user.password
       );

       if (!user || !checkPassword) {
         console.log("Hittade ej användare eller skrivit fel lösenord");
         res.status(403).json("Wrong username or password");
       }
       // Creating payload for jwt
       const payload = {
         userId: user._id,
         email: user.email,
         permissionLevel: user.permissionLevel,
       };

       // Creating accessToken/ refreshconfig
       const accConfig = {
         secret: process.env.ACCESS_TOKEN_SECRET,
         life: process.env.ACCESS_TOKEN_LIFE,
         payload: payload
       };
       const refConfig = {
         secret: process.env.REFRESH_TOKEN_SECRET,
         life: process.env.REFRESH_TOKEN_LIFE,
         payload: payload
       };
       // creating tokens
       const accessToken = createToken(accConfig);
       const refreshToken = createToken(refConfig);

      //Update refreshtoken
      await saveRefToken(user._id, refreshToken);

       res.status(200).json({
         access_token: accessToken,
         refresh_token: refreshToken,
       });
     } catch (error) {
       console.log("error i login");
       next(createError(403, "error i login"));
     }
   }
 }

