const { isAdmin } = require('../middleware/auth');
const Order = require('../Models/Order');
// const product = require('./product');

module.exports = {
// GET "Lista de ordenes" - '/orders';

  getOrders: async (req, res, next) => {
    // if(!isadmin=== false){
    //     return res.status(401).json('No hay autenticacion')
    // }
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const listOrder = await Order.paginate({}, options);
      return res.status(200).json(listOrder);
    } catch (err) {
      next(err);
    }
  },

  // GET "Datos de una orden especifica" - '/orders/:orderId'

  getOrder: async (req, res, next) => {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        res.sendStatus(401);
      }
      const order = await Order.findOne({ _id: orderId });
      if (!order) {
        res.sendStatus(404);
      }
      return res.status(200).json(order);
    } catch (err) {
      return next(404);
    }
  },

  // Post "Crea una nueva orden" - '/orders'

  createNewOrder: async (req, res, next) => {
    const { userId, client, products } = req.body;

    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).send();
      }
      if (!products || products.length === 0) {
        return res.status(400).send('No hay productos en la orden');
      }
      const newOrder = new Order({
        userId,
        client,
        products: products.map((item) => ({
          qty: item.qty,
          product: item.product,
        })),
      });
      const orderPopulate = await newOrder.populate('Product')
        .execPopulate();
      const orderSave = await orderPopulate.save();
      return res.status(200).send(orderSave);
    } catch (err) {
      next(404);
    }
  },

  // //PUT "Modificar orden" -'/orders/:orderId'

  updateOrder: async (req, res, next) => {
    const { orderId } = req.params.orderId;
    const { status } = req.body;
    console.info(5, req.body);
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).send('');
      }
      if (!status) return next(404);
      const statusOrder = [
        'pending',
        'canceled',
        'delivering',
        'delivered',
        'preparing',
      ];
      console.info(10, status);
      if (status && !statusOrder.includes(status)) return next(400);

      console.info(1, orderId);
      const orderUpdate = await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: req.body },
        { new: true },
      );
      console.info(3, orderUpdate);
      return res.status(200).json(orderUpdate);
    } catch (err) {
      next(404);
    }
  },

  // //DELETE "Eliminar orden" - '/orders/:orderId'

  deleteOrder: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      await Order.findOne({ _id: orderId });

      const deleteOrder = await Order.findByIdAndDelete({ _id: orderId });
      return res.status(200).json(deleteOrder);
    } catch (err) {
      next(404);
    }
  },
};
