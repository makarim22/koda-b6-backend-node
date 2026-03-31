import UserModel from "../models/users.model.js";

const authController = {
   async register(req, res){
    try{
      const { name, email, password, confirmPassword} = req.body;

      const isEmail = await UserModel.getByEmail(email);
      if (isEmail) {
        return res.status(404).json({ error: "email already registered" });
      }

      if (password !== confirmPassword) {
        return res.status(404).json({ error: "password doesn't match" });
      }

      const newUser = await UserModel.create({ name, email, password });
      res.status(201).json(newUser);

    } catch(err){

    }
   }
}

export default authController;