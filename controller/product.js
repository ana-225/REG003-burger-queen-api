const {
  isAdmin,
} = require('../middleware/auth');
const Product = require('../Models/Product');

module.exports = {
  // GET "Lista de productos" - '/products' 
  getProducts: async (req, res, next) => {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const products = await Product.paginate({}, options);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },

  // GET "Datos de un producto" - '/product/:productId'
  getProduct: async (req, res, next) => {
    try {
      const { productId } = req.params.productId;
      if (!productId) {
        res.sendStatus(401);
      }
      const product = await Product.findOne({
        _id: productId,
      });
      if (!product) {
        res.sendStatus(404);
      }
      return res.status(200).json(product);
    } catch (err) {
      return next(404);
    }
  },

  //Post "Crear producto" - '/products'

  createProduct: async (req, resp, next) => {
    const {
      name,
      price
    } = req.body;
    try {
      if (Object.keys(req.body).length === 0) {
        res.sendStatus(400);
      };
      const newProduct = new Product({
        name,
        price,
      });
      const productSave = await newProduct.save();
      console.log(productSave);
      return resp.status(200).send({
        _id: productSave._id,
        name: productSave.name,
        price: productSave.price,
      });
    } catch (err) {
      next()
    }
  },

  //PUT "Actualizar producto" -'/product/:productId'  

  updateProduct: async (req, res, next) => {
    // if(req.userauth.roles.admin === false) {
    //     res.sendStatus(403)

    // };
    const {
      name,
      price
    } = req.body;
    try {
      const productId = req.params.productId;
      if (price === 'undefined' || name === 'undefined') {
        res.status(400).send('No se indica nombre o precio del producto');
      };
      const productUpdate = await Product.findOneAndUpdate({
        _id: productId
      }, {
        $set: req.body
      }, {
        new: true
      }, );
      return res.status(200).json(productUpdate);
    } catch (err) {
      next(404);
    }
  },

  //DELETE "Eliminar producto" - '/products/:productId'

  deleteProduct: async (req, res, next) => {
    const productId = req.params.productId;

    try {
      // if(!isAdmin(req)) {
      //     res.status(403).send('No esta autorizado');
      // }
      const findProduct = await Product.findOne({
        _id: productId
      });
      console.log('esta pasando por try');
      await Product.findOneAndDelete({
        _id: productId
      });
      return res.status(200).json(findProduct);
    } catch (err) {
      console.log('esta pasando por catch');
      next(404);
    }
  }
};