import express from 'express';
import { getAllProducts, getProductById, addProduct } from '../services/productService.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', addProduct);

export default router;