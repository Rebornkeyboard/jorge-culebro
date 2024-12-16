import express from 'express';
//controller import
import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../Controllers/productController.js';

const router = express.Router();

//routes for product
router.post('/create', createProduct);
router.get('/read/:id', getProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/', getProducts);

export default router;