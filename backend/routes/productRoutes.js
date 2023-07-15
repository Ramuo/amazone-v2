import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
} from '../controllers/productControllers.js';

import {protect, admin} from '../middleware/authMiddleware.js'

//INITIALIZE EXPRESS
const router = express.Router();


//ROUTES
router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);
router.route('/top').get(getTopProducts);
router.route('/:id' )
    .get(getProductById )
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct); 
router.route('/:id/reviews').post(protect, createProductReview);


export default router; 