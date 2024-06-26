/**
 * Thêm thư viện
 */
import asyncHandler from "express-async-handler";
/**
 * thêm file 
 */
import Order from "../models/orderModel.js";

/**
 * POST one order
 * POST /api/orders
 * Thêm đặt hàng
 * Cập nhật API documents D.1
 * Thực hiện: Phạm Văn Á
 * Ngày 29/3/2024
 */
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,         // Xem orderModel(name, qty, image, price, product)
        shippingAddress,    // Xem orderModel(address, street, ward, district, city)
        paymentMethod,      // Xem orderModel(type)
        itemsPrice,         // Xem orderModel ()
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

/**
 * GET order by ID
 * lấy thông tin đơn hàng bằng id
 * GET /api/orders/:id  
 */
const getOrderByID = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

//GET update order to paid
//GET /api/orders/:id/pay
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
        throw new Error("Order not found | Không tìm thấy đơn hàng");
    }
});

/**
 * Cập nhật đặt hàng
 * 22/3/2024
 */
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found | Đơn hàng không tìm thấy");
    }
});

/**
 * GET user order 
 * GET /api/orders/myorders 
 */
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({
        user: req.user._id,
    });
    res.json(orders);
});

/**
 * ADMIN
 * GET  orders
 * GET / api / orders / myorders
 */
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "id name");
    res.json(orders);
});

export {
    updateOrderToPaid,
    updateOrderToDelivered,
    addOrderItems,
    getOrderByID,
    getMyOrders,
    getOrders,
};