
import productsModel from "../models/products.model.js";
import sizesModel from "../models/sizes.model.js";

const SizesController = {
  async getAllSizes(req, res) {
    try {
      const sizes = await sizesModel.getAll();
      res.json({
        status: 'success',
        data: sizes
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil daftar ukuran',
        error: error.message
      });
    }
  },

  async getSizesByProduct(req, res) {
    try {
      const { productId } = req.params;

      const product = await productsModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      const sizes = await sizesModel.getByProductId(productId);
      res.json({
        status: 'success',
        data: sizes
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil ukuran produk',
        error: error.message
      });
    }
  },

  async addSizeToProduct(req, res) {
    try {
      const { productId } = req.params;
      const { sizeId } = req.body;

      if (!sizeId) {
        return res.status(400).json({
          status: 'error',
          message: 'size_id diperlukan'
        });
      }

      const product = await productsModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      const sizeExists = await sizesModel.validateSizeExists(sizeId);
      if (!sizeExists) {
        return res.status(404).json({
          status: 'error',
          message: 'Ukuran tidak ditemukan'
        });
      }

      const isAssigned = await sizesModel.isAssignedToProduct(productId, sizeId);
      if (isAssigned) {
        return res.status(400).json({
          status: 'error',
          message: 'Ukuran sudah ditambahkan ke produk ini'
        });
      }

      // setelah semua validasi

      await sizesModel.addToProduct(productId, sizeId);
      res.status(201).json({
        status: 'success',
        message: 'Ukuran berhasil ditambahkan ke produk'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal menambahkan ukuran ke produk',
        error: error.message
      });
    }
  },

  async removeSizeFromProduct(req, res) {
    try {
      const { productId, sizeId } = req.params;

      const removed = await sizesModel.removeFromProduct(productId, sizeId);
      if (!removed) {
        return res.status(404).json({
          status: 'error',
          message: 'Ukuran tidak ditemukan di produk ini'
        });
      }

      res.json({
        status: 'success',
        message: 'Ukuran berhasil dihapus dari produk'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus ukuran dari produk',
        error: error.message
      });
    }
  },

  async createSize(req, res) {
    try {
      const { name, additionalPrice } = req.body;

      if (!name) {
        return res.status(400).json({
          status: 'error',
          message: 'nama ukuran diperlukan'
        });
      }

      const size = await sizesModel.create(name, additionalPrice || 0);
      res.status(201).json({
        status: 'success',
        data: size
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal membuat ukuran',
        error: error.message
      });
    }
  },

  async updateSize(req, res) {
    try {
      const { id } = req.params;
      const { name, additionalPrice } = req.body;

      const sizeExists = await sizesModel.validateSizeExists(id);
      if (!sizeExists) {
        return res.status(404).json({
          status: 'error',
          message: 'Ukuran tidak ditemukan'
        });
      }

      const size = await sizesModel.update(id, name, additionalPrice);
      res.json({
        status: 'success',
        data: size
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal memperbarui ukuran',
        error: error.message
      });
    }
  },

  async deleteSize(req, res) {
    try {
      const { id } = req.params;

      const deleted = await sizesModel.delete(id);
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Ukuran tidak ditemukan'
        });
      }

      res.json({
        status: 'success',
        message: 'Ukuran berhasil dihapus'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus ukuran',
        error: error.message
      });
    }
  }
}

export default SizesController;
