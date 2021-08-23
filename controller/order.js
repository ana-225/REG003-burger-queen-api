const { isAdmin } = require('../middleware/auth');
const Order = require ('../Models/Order');
// const product = require('./product');


module.exports = {
     
// GET "Lista de ordenes" - '/orders' 

getOrders: async (req, res, next)=> {
    try{
        const options = {
            page: parseInt(req.query.page, 10) || 1,
            limit: parseInt(req.query.limit, 10) || 10,
        };
        const listOrder =await Order.paginate({}, options);
        return res.status(200).json(listOrder);
    } catch (err){
        next(err)
    }
},

//GET "Datos de una orden especifica" - '/orders/:orderId'

getOrder: async (req, res, next)=> {
    try{
        const orderId =req.params.orderId;
       
        if (!orderId){
            res.sendStatus(401);
        }
        const order = await Order.findOne({_id:orderId});
        if (!order){
            res.sendStatus(404);
        }
        return res.status(200).json(order);
   
    } catch (err){
  
        return next(404);
    }
},

//Post "Crea una nueva orden" - '/orders'

createNewOrder: async (req, res, next)=>{
    const {userId, client, products}= req.body;
    
    try{
        if(Object.keys(req.body).length === 0) {
            return res.status(400).send('No hay productos en la orden');
        };
        const newOrder = new Order({
            userId,
            client,
            products: products
           });
      
       const orderSave = await newOrder.save();
       console.log(orderSave);
   res.status(200).send({newOrder});
    } catch (err){
        console.log(err)
        next(404)
    }
},

// //PUT "Modificar orden" -'/orders/:orderId'  

// updateOrder: async (req, res,next) => {
//     // if(req.userauth.roles.admin === false) {
//     //     res.sendStatus(403)

//     // };
//     const {name, price}= req.body;
//     try{
//         const productId = req.params.productId;
//         if (price ==='undefined'||name ==='undefined'){
//             res.status(400).send('No se indica nombre o precio del producto');
//         };
//     const productUpdate = await Product.findOneAndUpdate(
//         {_id: productId},
//         {$set: req.body},
//         {new: true},
//     );
//     return res.status(200).json(productUpdate);
//     } catch(err){
//       next(404);  
//     }
// },

// //DELETE "Eliminar orden" - '/orders/:orderId'

// deleteOrder: async (req, res, next) =>{
//     const productId = req.params.productId;

//     try{
//         // if(!isAdmin(req)) {
//         //     res.status(403).send('No esta autorizado');
//         // }
//         const findProduct = await Product.findOne({_id:productId});
//         await Product.findOneAndDelete({_id:productId});
//         return res.status(200).json(findProduct);
//     }catch(err){
//         next(404);  
//       }
// }
 };