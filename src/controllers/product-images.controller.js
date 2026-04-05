import ProductImage from "../models/productImage.model.js";
import ProductModel from "../models/products.model.js";
import fs from 'fs';
import path from 'path';

const productImagesController = {

  async uploadImage(req, res) {
    try {
      const { id } = req.params;
      const { isPrimary } = req.body;

      // Validate product exists
      const product = await ProductModel.getById(id);
      if (!product) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({
          error: 'Produk tidak ditemukan'
        });
      }

      // Validate file exists
      if (!req.file) {
        return res.status(400).json({
          error: 'File gambar tidak ditemukan'
        });
      }

      // If setting as primary, unset other primary images
      if (isPrimary === true || isPrimary === 'true') {
        await ProductImage.resetPrimaryImages(id);
      }

      // Store file path in database
      const imagePath = `/uploads/product-images/${req.file.filename}`;
      const imageRecord = await ProductImage.create(
        id,
        imagePath,
        isPrimary === true || isPrimary === 'true'
      );

      res.status(201).json({
        message: 'Gambar produk berhasil diunggah',
        data: imageRecord
      });
    } catch (err) {
      console.error(err);
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        error: 'Gagal mengunggah gambar produk'
      });
    }
  },

  async getProductImages(req, res) {
    try {
      const { productId } = req.params;

      const product = await ProductModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          error: 'Produk tidak ditemukan'
        });
      }

      const images = await ProductImage.getByProductId(productId);
      res.json({
        data: images
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'Gagal mengambil gambar produk'
      });
    }
  },

  async getPrimaryImage(req, res) {
    try {
      const { productId } = req.params;

      const product = await ProductModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          error: 'Produk tidak ditemukan'
        });
      }

      const image = await ProductImage.getPrimaryImage(productId);
      if (!image) {
        return res.status(404).json({
          error: 'Gambar utama tidak ditemukan'
        });
      }

      res.json({
        data: image
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'Gagal mengambil gambar utama'
      });
    }
  },

  async deleteImage(req, res) {
    try {
      const { imageId } = req.params;

      // Validate image exists
      const image = await ProductImage.getById(imageId);
      if (!image) {
        return res.status(404).json({
          error: 'Gambar tidak ditemukan'
        });
      }

      // Delete file from filesystem
      const filePath = path.join(process.cwd(), 'uploads/product-images', path.basename(image.path));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      await ProductImage.delete(imageId);

      res.json({
        message: 'Gambar berhasil dihapus'
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'Gagal menghapus gambar'
      });
    }
  },

  async setAsPrimary(req, res) {
    try {
      const { imageId } = req.params;

      const image = await ProductImage.getById(imageId);
      if (!image) {
        return res.status(404).json({
          error: 'Gambar tidak ditemukan'
        });
      }

      // Unset other primary images for this product
      await ProductImage.resetPrimaryImages(image.product_id);

      // Set this image as primary
      const updatedImage = await ProductImage.update(imageId, image.path, true);

      res.json({
        message: 'Gambar berhasil diatur sebagai gambar utama',
        data: updatedImage
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'Gagal mengatur gambar sebagai utama'
      });
    }
  }
};

export default productImagesController;