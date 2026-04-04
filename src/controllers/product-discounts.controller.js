import productDiscountsModel from "../models/productdiscount.model.js";
import productsModel from "../models/products.model.js";

const productDiscountsController = {
  async getDiscountsByProduct(req, res) {
    try {
      const { id: productId } = req.params;

      const product = await productsModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      const discounts = await productDiscountsModel.getByProductId(productId);
      res.json({
        status: 'success',
        data: discounts
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil diskon produk',
        error: error.message
      });
    }
  },

  async createDiscount(req, res) {
    try {
      const { id: productId } = req.params;
      const { discount_rate, description, is_flash_sale } = req.body;

      // Validate product exists
      const product = await productsModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      // Validate required fields
      if (!discount_rate) {
        return res.status(400).json({
          status: 'error',
          message: 'Persentase diskon diperlukan'
        });
      }

      // Validate discount rate
      if (discount_rate < 0 || discount_rate > 100) {
        return res.status(400).json({
          status: 'error',
          message: 'Persentase diskon harus antara 0-100'
        });
      }

      const newDiscount = await productDiscountsModel.create({
        product_id: productId,
        discount_rate,
        description: description || null,
        is_flash_sale: is_flash_sale || false,
        is_active: true
      });

      res.status(201).json({
        status: 'success',
        message: 'Diskon berhasil ditambahkan',
        data: newDiscount
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal menambahkan diskon produk',
        error: error.message
      });
    }
  },

  async updateDiscount(req, res) {
    try {
      const { id: productId, discountId } = req.params;
      const { discount_rate, description, is_flash_sale, is_active } = req.body;

      // Validate product exists
      const product = await productsModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      // Validate discount exists and belongs to product
      const discount = await productDiscountsModel.validateExists(discountId);
      if (!discount || discount.product_id !== parseInt(productId)) {
        return res.status(404).json({
          status: 'error',
          message: 'Diskon tidak ditemukan'
        });
      }

      // Validate discount rate if provided
      if (discount_rate !== undefined) {
        if (discount_rate < 0 || discount_rate > 100) {
          return res.status(400).json({
            status: 'error',
            message: 'Persentase diskon harus antara 0-100'
          });
        }
      }

      const updateData = {};
      if (discount_rate !== undefined) updateData.discount_rate = discount_rate;
      if (description !== undefined) updateData.description = description;
      if (is_flash_sale !== undefined) updateData.is_flash_sale = is_flash_sale;
      if (is_active !== undefined) updateData.is_active = is_active;

      const updatedDiscount = await productDiscountsModel.update(discountId, updateData);

      res.json({
        status: 'success',
        message: 'Diskon berhasil diperbarui',
        data: updatedDiscount
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal memperbarui diskon produk',
        error: error.message
      });
    }
  },

  async deleteDiscount(req, res) {
    try {
      const { id: productId, discountId } = req.params;

      // Validate product exists
      const product = await productsModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produk tidak ditemukan'
        });
      }

      // Validate discount exists and belongs to product
      const discount = await productDiscountsModel.validateExists(discountId);
      if (!discount || discount.product_id !== parseInt(productId)) {
        return res.status(404).json({
          status: 'error',
          message: 'Diskon tidak ditemukan'
        });
      }

      await productDiscountsModel.delete(discountId);

      res.json({
        status: 'success',
        message: 'Diskon berhasil dihapus'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus diskon produk',
        error: error.message
      });
    }
  }
};

export default productDiscountsController;