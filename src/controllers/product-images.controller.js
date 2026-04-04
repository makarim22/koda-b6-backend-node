import productImagesModel from "../models/productImage.model.js";
import productsModel from "../models/products.model.js";

const productImagesController = {
  async getImagesByProduct(req, res) {
    try {
      const { id: productId } = req.params;

      const product = await productsModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      const images = await productImagesModel.getByProductId(productId);
      res.json({
        status: 'success',
        data: images
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil gambar produk',
        error: error.message
      });
    }
  },

  async addImageToProduct(req, res) {
    try {
      const { id: productId } = req.params;
      const { path, is_primary } = req.body;

      // Validate product exists
      const product = await productsModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      // Validate required fields
      if (!path) {
        return res.status(400).json({
          status: 'error',
          message: 'Path gambar diperlukan'
        });
      }

      const newImage = await productImagesModel.create({
        product_id: productId,
        path,
        is_primary: is_primary || false
      });

      res.status(201).json({
        status: 'success',
        message: 'Gambar berhasil ditambahkan',
        data: newImage
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal menambahkan gambar produk',
        error: error.message
      });
    }
  },

  async updateImage(req, res) {
    try {
      const { id: productId, imageId } = req.params;
      const { path, is_primary } = req.body;

      // Validate product exists
      const product = await productsModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      // Validate image exists and belongs to product
      const image = await productImagesModel.validateExists(imageId);
      if (!image || image.product_id !== parseInt(productId)) {
        return res.status(404).json({
          status: 'error',
          message: 'Gambar tidak ditemukan'
        });
      }

      const updateData = {};
      if (path) updateData.path = path;
      if (is_primary !== undefined) updateData.is_primary = is_primary;

      const updatedImage = await productImagesModel.update(imageId, updateData);

      res.json({
        status: 'success',
        message: 'Gambar berhasil diperbarui',
        data: updatedImage
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal memperbarui gambar produk',
        error: error.message
      });
    }
  },

  async deleteImage(req, res) {
    try {
      const { id: productId, imageId } = req.params;

      // Validate product exists
      const product = await productsModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      // Validate image exists and belongs to product
      const image = await productImagesModel.validateExists(imageId);
      if (!image || image.product_id !== parseInt(productId)) {
        return res.status(404).json({
          status: 'error',
          message: 'Gambar tidak ditemukan'
        });
      }

      await productImagesModel.delete(imageId);

      res.json({
        status: 'success',
        message: 'Gambar berhasil dihapus'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus gambar produk',
        error: error.message
      });
    }
  }
};

export default productImagesController;