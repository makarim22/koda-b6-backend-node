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

    const {name} = req.query;
    console.log("namanya", name);

    try {
      if(name){
      const product = await productsModel.getByName(name);
      return res.json(product ? [product] : []);
    }
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const products = await productsModel.getAll(page, limit);
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retreive products" });
    }
  },
  /**
   * Gets a single product by ID
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async getProductById(req, res) {
    try {
      const product = await productsModel.getById(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  },

  /**
   * Updates a product
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async updateProduct(req, res) {
    try {
      const product = await productsModel.update(
        parseInt(req.params.id),
        req.body
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update product" });
    }
  },

  /**
   * Deletes a product
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async deleteProduct(req, res) {
    try {
      const deleted = await productsModel.delete(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete product" });
    }
  },
};

export default productsController;
