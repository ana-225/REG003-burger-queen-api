const jwt = require('jsonwebtoken');
const users = require('../Models/User')

module.exports = (secret) => (req, resp, next) => {
  const {
    authorization
  } = req.headers; // Kathy comenta:Authorization aparece en el objeto cuando una persona intenta conectarse?
  console.log(req)
  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`

    try {
      const userValidate = await users.findOne({_id: decodedToken.uid})
      if (!userValidate) {
        return next(404);
      }
      const userValidateObject = userValidate;
      Object.assign(req.headers, userValidateObject)
      next()
    } catch (error) {
      return next(403);
    }
  });
};

// TODO: decidir por la informacion del request si la usuaria esta autenticada
module.exports.isAuthenticated = (req) => (!!req.headers.userValidate);

// TODO: decidir por la informacion del request si la usuaria es admin
module.exports.isAdmin = (req) => (req.headers.userValidate.roles.admin);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req)) ?
  next(401) :
  next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req)) ?
  next(401) :
  (!module.exports.isAdmin(req)) ?
  next(403) :
  next()
);