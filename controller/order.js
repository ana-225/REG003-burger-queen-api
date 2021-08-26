const { isAdmin } = require('../middleware/auth');
const Order = require('../Models/Order');
// const product = require('./product');


module.exports = {

    // GET "Lista de ordenes" - '/orders' 

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
            next(err)
        }
    },

    //GET "Datos de una orden especifica" - '/orders/:orderId'

    getOrder: async (req, res, next) => {
        try {
            const orderId = req.params.orderId;

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

    //Post "Crea una nueva orden" - '/orders'

    createNewOrder: async (req, res, next) => {
        console.log(req.body);

        const { userId, client, products } = req.body;

        try {
            if (Object.keys(req.body).length === 0) {
                return res.status(400).send();

            };
            if (!products || products.length === 0) {
                return res.status(400).send('No hay productos en la orden');
            };
            const newOrder = new Order({
                userId,
                client,
                products: products.map((item) => ({
                    qty: item.qty,
                    product: item.product,
                })
                )
            });
            const orderPopulate = await newOrder.populate('Product')
                .execPopulate();
            const orderSave = await orderPopulate.save();
            console.log(orderSave);
            return res.status(200).send(orderSave);
        } catch (err) {

            next(404)
        }
    },

    // //PUT "Modificar orden" -'/orders/:orderId'  

    updateOrder: async (req, res,next) => {
        // const {orderId, status}= req.body;
        // if(req.userauth.roles.admin === false) {
        //     res.sendStatus(403)
        //  
        // // };
        // if (!req.body.client) {
        //     return next(400);
        //   }

         const {orderId} = req.params.orderId;
        const {status} = req.body;
        try{
            
           
            if (Object.keys(req.body).length === 0) {
                return res.status(400).send('');
                
            };
            if (!isObjectId(orderId)) return next(400);
            const statusOrder = [
                'pending',
                'canceled',
                'delivering',
                'delivered',
              ];
            if (status && !statusOrder.includes(status)) return next(400);
            console.log(1, orderId);
        const orderUpdate = await Order.findOneAndUpdate(
            {_id: orderId},
            {$set: req.body},
            {new: true},
        );
        console.log(3, orderUpdate)
        return res.status(200).json(orderUpdate);
        } catch(err){
          next(404);  
        }
    },

    // //DELETE "Eliminar orden" - '/orders/:orderId'

    deleteOrder: async (req, res, next) => {

        try {
        
            const orderId = req.params.orderId;
            console.log(orderId);
            if (!req.headers.validated) {
                return res.status(401).send('No esta autenticado')
            };
            
            if (!isObjectId(orderId)) {
                return res.status(404).send('No se encuentra orden');
            };
            if (!req.headers.validate.roles.admin){
                return res.status(403).send();
            }
            
            const findOrder = await Order.findOne({ _id: orderId });

            await Order.findOneAndDelete({ _id: orderId });
            return res.status(200).json(findOrder);
        } catch (err) {
            next(404);
        }
    }
};