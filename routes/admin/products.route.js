import express from "express";
import { createProduct, createProductsMulter, deleteProduct, fetchProducts, getProduct, handleDeleteImage, handleImageUpload, updateProduct, } from "../../controllers/admin/product.controller.js";
import { multerUpload } from "../../helpers/fileUploader.js";
import { fileUploader } from "../../middlewares/fileUpload.middleware.js";

const router = express.Router();

router.post('/cloudinary', multerUpload.single('image'), handleImageUpload);
router.post('/upload-image', fileUploader.single('imageFile'), handleImageUpload);
router.delete('/delete-image/:image', handleDeleteImage);

router.get('/', fetchProducts);
router.post('/', createProduct);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);



export default router;