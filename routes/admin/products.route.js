import express from "express";
import { createProducts, createProductsMulter, deleteProducts, fetchProducts, handleImageUpload, updateProducts } from "../../controllers/admin/product.controller.js";
import { multerUpload } from "../../helpers/fileUploader.js";
import { fileUploader } from "../../middlewares/fileUpload.middleware.js";

const router = express.Router();

router.post('/cloudinary', multerUpload.single('image'), handleImageUpload);
router.post('/upload-image', fileUploader.single('imageFile'), handleImageUpload);
router.get('/', fetchProducts);
router.post('/', createProducts);
router.put('/', updateProducts);
router.delete('/', deleteProducts);



export default router;