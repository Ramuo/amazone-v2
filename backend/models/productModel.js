import mongoose from 'mongoose';

// REVIEWS SCHEMA
const reviewSchema = mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    }, {
        timestamps: true,
    }
); 


// PRODUCT SCHEMA
const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name:{
        type: String,
        required: true,
        unique: true,
    },
    image:{
        type: String,
        required: true,
    },
    images:{
        type: String,
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reviews: [reviewSchema],
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});


const Product = mongoose.model('Product', productSchema);

export default Product;