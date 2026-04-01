import UserModel from "../models/users.model.js";
import {generateJWT} from "../lib/jwt.js"
import "dotenv/config"

import argon2 from "argon2";

const authController = {
  async register(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      const isEmail = await UserModel.getByEmail(email);
      if (isEmail) {
        return res.status(404).json({ error: "email already registered" });
      }

      if (password !== confirmPassword) {
        return res.status(404).json({ error: "password doesn't match" });
      }

      const hashedPassword = await argon2.hash(password);
      console.log("hashedPassword", hashedPassword);

      const newUser = await UserModel.create({
        name: name,
        email,
        password: hashedPassword,
      });


      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json("error database")
    }
  },

   async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "email and password required" });
      }

      const user = await UserModel.getByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "invalid credentials" });
      }

      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "invalid credentials" });
      }

       const jwtConfig = { 
      Secret: process.env.JWT_SECRET, 
      Expiration: 3600000, 
      Issuer: 'coffeeshop-api' 
      };

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      const token = generateJWT(user.id, user.email, jwtConfig)
       res.status(200).json({ message: "login succeeded", token, user: userWithoutPassword });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default authController;
