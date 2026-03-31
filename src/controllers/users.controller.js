import UserModel from "../models/users.model.js";

import argon2 from "argon2";

const UserController = {
  /**
   * Creates a new user
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async createUser(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }

      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ error: "confirm password doesn't match" });
      }

      const hashedPassword = await argon2.hash(password)
      console.log("hashedPassword", hashedPassword);

      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword, 
      });
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create user" });
    }
  },

  /**
   * Gets all users with pagination
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const users = await UserModel.getAll(page, limit);
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  /**
   * Gets a single user by ID
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async getUserById(req, res) {
    try {
      const user = await UserModel.getById(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  },

  /**
   * Updates a user
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async updateUser(req, res) {
    try {
      const user = await UserModel.update(parseInt(req.params.id), req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update user" });
    }
  },

  /**
   * Deletes a user
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async deleteUser(req, res) {
    try {
      const deleted = await UserModel.delete(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete user" });
    }
  },
};

export default UserController;
