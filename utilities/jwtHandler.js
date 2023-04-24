// jwtHandler.js

import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode';
const { TokenExpiredError } = jwt;
import createError from "http-errors";
import { authRefreshToken } from './refreshTokenHandler.js';

/**
 * Authenticates requests.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const authAccessToken = async (req, res, next) => {
  const authorization = req.headers.authorization?.split(" ");
  if (authorization?.[0] !== "Bearer") {
    console.log("No Bearer token available");
    next(createError(401, "No bearer token"));
    return;
  }
  try {
    console.log("__Verifying access___");
    const accessTokenResult = jwt.verify(
      authorization[1],
      process.env.ACCESS_TOKEN_SECRET
    );

    const { userId, email, permissionLevel } = accessTokenResult;
    req.user = {
      userId,
      email,
      permissionLevel,
    };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.log("___access token expired-creating new___");
      //check reftoken, decode to get userId
      const { userId } = jwtDecode(authorization[1]);
      const userInfo = await authRefreshToken(userId);
      req.user = { ...userInfo };
      return next();
    }
    console.log("Not a valid Refreshtoken");
    next(createError(403));
  }
};

/**
 * Authorize requests.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {number} permissionLevel - ...
 */
export const hasPermission = (req, res, next, permissionLevel) => {
  req.user.permissionLevel >= permissionLevel ? next() : next(createError(403));
};

export const createToken = (tokenConfig) => {
  const { secret, life, payload } = tokenConfig;
  // Creating accessToken
  const Token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: life,
  });
  return Token;
};

