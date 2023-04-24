/**
 * Module for the User Controller.
 *
 * @author Kaj Berg
 * @version 0.1.0
 */

import UserModel from "../models/usermodel.js";
import createError from "http-errors";
import { hashThisPassword } from "../utilities/passwordHandler.js";

/**
 * Encapsulates a controller.
 */
export class UserController {
  // Transforming incoming data
  transformData(user) {
    return {
      id: user._id,
      email: user.email,
      permissionLevel: user.permissionLevel,
      refToken: user.refToken
    };
  }

  /**
   * If url has a param.
   * Get a user and save as req.user
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async loadUser(req, res, next, id) {
    try {
      const user = await UserModel.findOne({ _id: id });
      if (!user) {
        next(createError(404));
        return;
      }
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create(req, res, next) {
    console.log(req.body);
    const { email, password } = req.body;

    const newUser = new UserModel({
      email: email,
      password: hashThisPassword(password),
      permissionLevel: 4,
      refToken: ""
    });

    try {
      // Saving user in DB
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.log("Error creating user", error.message);
      error.status = 409;
      error.message = "Error creating user";
      next(error);
    }
  }

  /**
   * Check if user exists
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUser(req, res, next) {
    console.log("req query", req.query);
    try {
      const userExists = await UserModel.findOne({ email: req.query.email });
      console.log("user exist", userExists);
      if (userExists) {
        return res.status(409).json("user exists");
      }
      res.status(204).json("user dont exists");
    } catch (error) {
      error.status = 404;
      error.message = "No Users to show";
      next(error);
    }
  }

  /**
   * Get a user by id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getById(req, res, next) {
    try {
      res.status(200).json(this.transformData(req.user));
    } catch (error) {
      error.status = 404;
      error.message = "No Users to show";
      next(error);
    }
  }

  /**
   * Get all users
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await UserModel.find({});
      res.status(200).json(users);
    } catch (error) {
      error.status = 404;
      error.message = "No Users to show";
      next(error);
    }
  }

  /**
   * Delete a user and its Events/todos.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete(req, res, next) {
    console.log("delete this user:", req.user);
    const { userId } = req.user;
    try {
      await UserModel.deleteOne({ _id: userId });
      console.log("User deleted");
      // await CalendarModel.deleteMany({ userId: userId });
      res.status(204).json("User deleted");
    } catch (error) {
      error.status = 404;
      error.message = "No User to delete or error deleting user";
      next(error);
    }
  }
}
