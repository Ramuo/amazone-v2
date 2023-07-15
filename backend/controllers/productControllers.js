import Product from '../models/productModel.js';
import asyncHandler from '../middleware/asyncHandler.js';


//@desc     Get All Products
//@route   GET api/products
//@access Public
// const getProducts = asyncHandler(async(req, res) => {
//     const products = await Product.find({});
//     res.status(200).json(products);
// });

//@desc     Get All Products
//@route   GET api/products
//@access Public
const getProducts = asyncHandler(async(req, res) => {
    //1- Let's initialize a page Size variable
    const pageSize = 8;
    //2- Let's initialize a page variable and set it to the page number in the Url. 
    //to get query params in url, we user: req.query.pageNumber, if that not there we set it to one
    const page = Number(req.query.pageNumber) || 1;

    //To serach product with keyword
    const keyword = req.query.keyword
        ? {
            name: {
            $regex: req.query.keyword,
            $options: 'i',
            },
        }
        : {};
        
    // 3 - Let's get the total number of pages
    const count = await Product.countDocuments({...keyword});

    //4 - Let's get the product
    const products = await Product.find({...keyword})
        .limit(pageSize)
        .skip(pageSize * (page - 1));


    res.status(200).json({products, page, pages: Math.ceil(count / pageSize)});
});


//@desc    Get Single Product
//@route   GET api/product/:id
//@access  Public
const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);

    if(product){
       return res.json(product);
    }else{
        res.status(404);
        throw new Error('Ressource not found')
    }
});


//@desc   Create Product
//@route  POST api/products
//@access Private/Admin
const createProduct = asyncHandler(async(req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/boy.jpg',
        brand: 'Sample Brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
});


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { 
      name, 
      price, 
      description, 
      image,
      brand, 
      category, 
      countInStock 
    } = req.body;
  
    const product = await Product.findById(req.params.id);
  
    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;
  
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Produit non trouvé pour la mise à jour');
    }
});

//@desc     Delete All Product
//@route    DELETE api/products/:id
//@access   Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);

    if(product){
        await Product.deleteOne({_id: product._id});
        res.status(200).json({message: 'Produit supprimé'});
    }else{
        res.status(404);
        throw new Error("Produit non trouvé")
    }
});

//@desc     Create a new review for product
//@route    POST api/products/:id/reviews
//@access   Private
const createProductReview = asyncHandler(async(req, res) => {
    //1- Let's get the rating and the comment from body
    const {rating, comment} = req.body;

    //2- Let'us get the product
    const product = await Product.findById(req.params.id);

    //3- Let's check if the product was already reviewed
    if(product){
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if(alreadyReviewed){
            res.status(400);
            throw new Error("Vous avez déjà laissé un avis");
        };

        //- Create a review object
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        };

        //Let' us push the created review to review collection
        product.reviews.push(review);

        //Let's set numReviews = to product reviews length
        product.numReviews = product.reviews.length;

        //To GET the rating, add ratings with reduce then divide it by the reviews lenght
        product.rating =
            product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({message: 'Avis ajouté'});
        
    }else{
        res.status(404);
        throw new Error('Produit non trouvé');
    }
});


//@desc     Get Top Rated Products
//@route   GET api/products/top
//@access Public
const getTopProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(4);

    res.status(200).json(products);
});


export {
    getProducts,
    getProductById ,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts
}