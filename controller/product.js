const {
  isAdmin
} = require('../middleware/auth');
const Product = require('../Models/Product');
const {
  pagination
} = require('../utils/utils')

module.exports = {
  // GET "Lista de productos" - '/products' 
  getProducts: async (req, res, next) => {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const allProducts = await Product.paginate({}, options);
      const url = `${req.protocol}://${req.get('host') + req.path}`;
      const links = pagination(allProducts, url, options.page, options.limit, allProducts.totalPages);
      res.links(links);
      return res.status(200).json(allProducts.docs);
    } catch (err) {
      next(err);
    }
  },

  //GET "Datos de un producto" - '/product/:productId'
  getProduct: async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const product = await Product.findOne({_id: productId});
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
    const { name, price, image, type, dateEntry } = req.body;
    try {
      if (!name || !price ) {
        resp.sendStatus(400);
      };
      const newProduct = new Product({
        name,
        price,
        image,
        type,
        dateEntry,
      });
      
      const productSave = await newProduct.save();
      
      return resp.status(200).send(productSave);
    } catch (err) {
      console.log(err)
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
      const findProduct = await Product.findOne({ _id: productId });
      const prueba = await Product.findOneAndDelete({ _id: productId });
      console.log(prueba)
      return res.status(200).json(findProduct);
    } catch (err) {
      next(404);
    }
  }
};