// module.exports = {
//     getUsers: (req, resp, next) => {
//     },
//   };

const Product = require ('../Models/Product');

getProducts:

//Peticion Get '/product/:productId'
getProduct: async (req, res, next)=> {
    try{
        const productId =req.param.productId;
        const product = await product.findOne({_id:productId});
        return res.status(200).json(productId);
    
    } catch (err){
        return next(err);
    }
};

//Post

createProduct: async (req, resp, next)=>{
    const {name, price}= req.body;
    try{
        //verificar permisos luego de eso pasamos a crear el producto
        const newProduct = new Product({
            name,
            price,
        });
        const product = await newProduct.save(newProduct);
        return resp.status(200).send({})
    }
}
 