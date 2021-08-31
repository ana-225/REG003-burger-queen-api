const Order = require('../Models/Order');
const { pagination } = require('../utils/utils')

module.exports = {
// GET "Lista de ordenes" - '/orders';
  getOrders: async (req, res, next) => {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const listOrder = await Order.paginate({}, options)
      const url = `${req.protocol}://${req.get('host') + req.path}`;
      const links = pagination(listOrder, url, options.page, options.limit, listOrder.totalPages);
      res.links(links);
      return res.status(200).json(listOrder.docs);
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
      const order = await Order.findOne({ _id: orderId }).populate('products.product');
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

    const {
      userId,
      client,
      products
    } = req.body;
  
    try {
      if (Object.keys(req.body).length === 0) {
        return res.sendStatus(400);
  
      };
      if (!products || products.length === 0) {
        return res.status(400).send('No hay productos en la orden');
      };
      const newOrder = new Order({
        userId,
        client,
        products,
  
      });
      
      const orderSave = await newOrder.save();
      const orderPopulate =  await Order.findOne({ _id: orderSave._id }).populate('products.product');
      return res.status(200).send(orderPopulate);
    } catch (err) {
      next(404)
    }
  },

  // //PUT "Modificar orden" -'/orders/:orderId'

  updateOrder: async (req, res, next) => {
    const  orderId  = req.params.orderId;
    const { status } = req.body;
    try {
      if (Object.keys(req.body).length === 0) {
        return res.sendStatus(400);
      }
      if (!status) return next(404);
      const statusOrder = [
        'pending',
        'canceled',
        'delivering',
        'delivered',
        'preparing',
      ];
      if (status && !statusOrder.includes(status)) return next(400);
      const orderUpdate = await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: req.body },
        { new: true },
      ).populate('products.product');
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
