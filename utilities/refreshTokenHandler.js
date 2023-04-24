// jwtHandler.js

import jwt from 'jsonwebtoken'
import jwtDecode from "jwt-decode";
import createError from "http-errors";
import UserModel from "../models/usermodel.js";
import { createToken } from "./jwtHandler.js";
/**
 * Refresh accestoken
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const authRefreshToken = async (userId) => {
  console.log('_i autreftoken', userId)
  try {
    const refMongo = await UserModel.findOne({ _id: userId });
    if (!refMongo) {
      console.log("no user/reftoken exist");
      throw createError(409);
    }

    // getting token from Mongo Db
    const { refToken } = refMongo;
    const refTokenResult = jwt.verify(
      refToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    //If not ref token
    if (!refTokenResult) {
      console.log("error i authRefresh, refToken");
      throw createError(403);
    }

    const user = await UserModel.findOne({ _id: userId });
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
      payload: payload,
    };
    const refConfig = {
      secret: process.env.REFRESH_TOKEN_SECRET,
      life: process.env.REFRESH_TOKEN_LIFE,
      payload: payload,
    };

    // creating tokens
    const accessToken = createToken(accConfig);
    const refreshToken = createToken(refConfig);

    //refreshToken uppdateras
    saveRefToken(user._id, refreshToken)

    // const decodeResult = jwtDecode(accessToken);
    // const { userId:newId, email, permissionLevel } = decodeResult;

    return payload;
  } catch (error) {
    console.log("Error in authreftoken");
    throw createError(409);
  }
};


/**
 * MongoDb update one.
 *
 * @param {*} filter - Parameters to filter by.
 * @param {*} update - What dokument to update.
 * @return {*} 
 */
export const saveRefToken = async (userId, refreshToken ) => {
  const filter = { _id: userId}
  const update = { refToken: refreshToken }
  const options = { new: true, upsert: true}
  try {
    console.log("updating & saving reftoken");
    await UserModel.findOneAndUpdate(filter, update, options);
    return
  } catch (error) {
    console.log("error i saveRefToken");
    throw createError(403);
  }
};

