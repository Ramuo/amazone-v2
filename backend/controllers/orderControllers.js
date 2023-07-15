import Order from '../models/orderModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

//@desc     Create new order
//@route    POST /api/orders
//@access   Private
const addOrderItems = asyncHandler(async(req, res) => {
    //Items which we will get from the body through backend
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;;

    //Let'us check if order is empty or not then create it
    if(orderItems && orderItems.length === 0){
        res.status(400);
        throw new Error("Aucun article commandé");
    }else{
        const order = new  Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        //Save the created order
        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    };
});

//@desc     Get Order By ID
//@route    GET /api/orders/:id
//@access   Private
const getOrderById = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email',
        //We populate from the user collection, name & email to order collection
    );
    
    if(order){
        res.status(200).json(order);
    }else{
        res.status(404);
        throw new Error('Commande non trouvée')
    }
});

//@desc     Get Logged in user orders
//@route    GET /api/orders/mine
//@access   Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
});


//@desc     Update order To paid
//@route    PUT /api/orders/:id/pay
//@access   Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
  
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };
  
      const updatedOrder = await order.save();
  
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
  
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
  
      const updatedOrder = await order.save();
  
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
});

//@desc     Get All orders
//@route    GET /api/orders
//@access   Private/Admin
const getOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');

    res.status(200).json(orders);
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
}
