import OrderRepo from '../Model/Order.js';
import OrderStatusRepo from '../Model/OrderStatus.js';
import ProductRepo from '../Model/Product.js';
import {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} from 'http-status-codes';

function handleError(error, res) {
    if (error.name == 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((validationError) => validationError.message);
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Validation error.', errors: validationErrors });
    } else if (error.name == 'CastError') {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Given ID is not type of ObjectID.' })
    };
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
}

export const getOrders = async (req, res) => {
    try {
        const orders = await OrderRepo.find();
        if (orders.length == 0) {
            return res.status(StatusCodes.NO_CONTENT).json(orders);
        }
        else return res.status(StatusCodes.OK).json(orders);
    } catch {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
}

export const getOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Id is mandatory.' });
        }
        const order = await OrderRepo.findById(id);
        if (order) {
            return res.status(StatusCodes.OK).json(order);
        } else {
            return res.status(StatusCodes.NO_CONTENT).json(null);
        }
    } catch (error) {
        handleError(error, res);
    }
}

export const getOrdersByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username is mandatory.' });
        }

        const orders = await OrderRepo.find({ 'user.username': username });
        if (orders.length == 0) {
            return res.status(StatusCodes.NO_CONTENT).json(orders);
        }
        else return res.status(StatusCodes.OK).json(orders);
    } catch (error) {
        handleError(error, res);
    }
}

export const getOrdersByStatus = async (req, res) => {
    try {
        const statusId = req.params.status;
        if (!statusId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Status is mandatory.' });
        }

        const orders = await OrderRepo.find({ 'status.id': statusId });
        if (orders.length == 0) {
            return res.status(StatusCodes.NO_CONTENT).json(orders);
        }
        else return res.status(StatusCodes.OK).json(orders);
    } catch (error) {
        handleError(error, res);
    }
}

export const addOrder = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid request. Order data is missing.' });
        }

        const { approvalDate, orderStatusId, username, email, phoneNumber, products } = req.body;
        const orderStatus = await OrderStatusRepo.findById(orderStatusId);
        if (!orderStatus) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Order status with given id does not exists.' });
        }

        const productsArray = [];

        for (let element of products) {
            const productId = element.productId;

            const product = await ProductRepo.findById(productId);
            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: `Product with id ${productId} does not exists.` });
            }

            productsArray.push({
                product: product,
                quantity: element.quantity,
            });
        }

        const order = await OrderRepo.create({
            approvalDate: new Date(approvalDate),
            orderStatus: orderStatus,
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            products: productsArray,
        });
        return res.status(StatusCodes.CREATED).json(order);
    } catch (error) {
        handleError(error, res);
    }
}