import UserModel from "../models/users.model.js";

function createUserController() {
  return {
    createUser(req, res) {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }

      const user = UserModel.create({ name, email });
      res.status(201).json(user);
    },

    getAllUsers(req, res) {
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 10;
  
      const users = UserModel.getAll(page, limit);
      res.json(users);
    },

    getUserById(req, res) {
      const user = UserModel.getById(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    },

    updateUser(req, res) {
      const user = UserModel.update(parseInt(req.params.id), req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    },

    deleteUser(req, res) {
      const deleted = UserModel.delete(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    }
  };
}

export default createUserController();