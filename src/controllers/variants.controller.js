import productsModel from "../models/products.model.js";
import variantsModel from "../models/variants.model.js";


const VariantsController = {
  async getAllVariants(req, res) {
    try {
      const variants = await variantsModel.getAll();
      res.json({
        status: 'success',
        data: variants
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil daftar varian',
        error: error.message
      });
    }
  },

  async getVariantsByProduct(req, res) {
    try {
      const { id } = req.params;

      console.log("product_id nya", id)

      const product = await productsModel.getById(id);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      const variants = await variantsModel.getByProductId(id);
      res.json({
        status: 'success',
        data: variants
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil varian produk',
        error: error.message
      });
    }
  },

  async addVariantToProduct(req, res) {
    try {
      const { productId } = req.params;
      const { variantId } = req.body;

      if (!variantId) {
        return res.status(400).json({
          status: 'error',
          message: 'variant_id diperlukan'
        });
      }

      const product = await productsModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      const variantExists = await variantsModel.validateVariantExists(variantId);
      if (!variantExists) {
        return res.status(404).json({
          status: 'error',
          message: 'Varian tidak ditemukan'
        });
      }

      const isAssigned = await variantsModel.isAssignedToProduct(productId, variantId);
      if (isAssigned) {
        return res.status(400).json({
          status: 'error',
          message: 'Varian sudah ditambahkan ke produk ini'
        });
      }

      // setelah semua validasi

      await variantsModel.addToProduct(productId, variantId);
      res.status(201).json({
        status: 'success',
        message: 'Varian berhasil ditambahkan ke produk'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal menambahkan varian ke produk',
        error: error.message
      });
    }
  },

  async removeVariantFromProduct(req, res) {
    try {
      const { productId, variantId } = req.params;

      const removed = await variantsModel.removeFromProduct(productId, variantId);
      if (!removed) {
        return res.status(404).json({
          status: 'error',
          message: 'Varian tidak ditemukan di produk ini'
        });
      }

      res.json({
        status: 'success',
        message: 'Varian berhasil dihapus dari produk'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus varian dari produk',
        error: error.message
      });
    }
  },

  async createVariant(req, res) {
    try {
      const { name, additionalPrice } = req.body;

      if (!name) {
        return res.status(400).json({
          status: 'error',
          message: 'nama varian diperlukan'
        });
      }

      const variant = await variantsModel.create(name, additionalPrice || 0);
      res.status(201).json({
        status: 'success',
        data: variant
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal membuat varian',
        error: error.message
      });
    }
  },

  async updateVariant(req, res) {
    try {
      const { id } = req.params;
      const { name, additionalPrice } = req.body;

      const variantExists = await variantsModel.validateVariantExists(id);
      if (!variantExists) {
        return res.status(404).json({
          status: 'error',
          message: 'Varian tidak ditemukan'
        });
      }

      const variant = await variantsModel.update(id, name, additionalPrice);
      res.json({
        status: 'success',
        data: variant
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal memperbarui varian',
        error: error.message
      });
    }
  },

  async deleteVariant(req, res) {
    try {
      const { id } = req.params;

      const deleted = await variantsModel.delete(id);
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Varian tidak ditemukan'
        });
      }

      res.json({
        status: 'success',
        message: 'Varian berhasil dihapus'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus varian',
        error: error.message
      });
    }
  }
}

export default VariantsController;
