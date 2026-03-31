import productsModel from "../models/products.model.js";

const productsController = {
  async createProduct(req, res) {
    try {
      const { name, desc, stock, price } = req.body;

      const product = await productsModel.create({
        name,
        desc,
        stock,
        price,
      });
      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create product" });
    }
  },
  /**
   * Gets all products with pagination
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const products = await productsModel.getAll(page, limit);
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retreive products" });
    }
  },
};

export default productsController;
