import productsModel from "../models/products.model.js";

const productsController = {
  async createProduct(req, res) {
    try {
      const { name, desc, stock, price } = req.body;

      const product = await productsModel.create({
        name,
        desc,
        stock,
        price
      });
      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create product" });
    }
  },
};

export default productsController;
