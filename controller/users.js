const bcrypt = require('bcrypt');
const Users = require('../Models/User');
const { requireAdmin, requireAuth } = require('../middleware/auth');
const { pagination, isEmailOrID, isAValidEmail, isAValidPassword, verifyRoles } = require('../utils/utils') 

module.exports = {

  // GET "Lista de usuarios" - '/users'
  getUsers: async (req, res, next) => {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const allUsers = await Users.paginate({}, options);
      const url = `${req.protocol}://${req.get('host') + req.path}`;
      const links = pagination(allUsers, url, options.page, options.limit, allUsers.totalPages);
      res.links(links);
      return res.status(200).json(allUsers.docs);
    } catch (error) {
      return next(500);
    }
  },

  // GET "Busqueda de un usuario segun el id entregado" - '/users/:uid'

  getUser: async (req, res, next) => {
    try {
      const { uid } = req.params;
      const validateUid = isEmailOrID(uid);
      const findUserByIdOrEmail = await Users.findOne(validateUid);
      const userAuth = req.headers.validated;
      if (!findUserByIdOrEmail) {
        res.sendStatus(404); 
      } else if (!userAuth.roles.admin && !(userAuth.id === uid || userAuth.email === uid)) {
        return res.status(403).send('No es admin o la misma usuaria que desea ver sus datos');
      }
      res.status(200).send(findUserByIdOrEmail);
    } catch (error) {
      return next(500);
    }
  },

  // POST "Crear usuario" - '/users'

  createUser: async (req, res) => {
    try {
      const { email, password, roles, } = req.body;
      if (!isAValidEmail(email) || !isAValidPassword(password)) {
        return res.status(400).send('Por favor ingresa email y contraseña validos');
      }
      const user = {
        email,
        password: bcrypt.hashSync(password, 10),
        roles,
      };
      const verifyEmail = await Users.find({
        email,
      });
      if (verifyEmail.length !== 0) {
        return res.status(403).send('Email ya registrado');
      }
      const newUser = new Users(user);
      await newUser.save();
      const sendUser = {
        _id: newUser._id,
        email: newUser.email,
        roles: newUser.roles,
      };
      res.status(200).send(sendUser);
    } catch (error) {
      res.status(400).send('Por favor, recuerda ingresar tu contraseña y password.');
    }
  },

  // PUT "Actualizar usuario" - '/users/:uid'

  updateUser: async (req, res) => {
    try {
      const { uid } = req.params;
      const update  = req.body;
      const validateUid = isEmailOrID(uid);
      const userAuth = req.headers.validated;
      const user = await Users.findOne(validateUid).select('+password');
      if (!user) {
        return res.status(404).send('No existe el usuario');
      } else if (!userAuth.roles.admin && !(userAuth.id === uid || userAuth.email === uid)) {
        return res.status(403).send('No es admin o la misma usuaria que desea actualizar sus datos.');
      } else if (update.roles.admin !== user.roles.admin && (!userAuth.roles.admin)) {
        return res.status(403).send('Debes ser administrador para modificar tus roles');    
      } 
      const verify = verifyRoles(update);
      const updatingUser = await Users.findOneAndUpdate( validateUid, {$set: verify}, {new: true});
      res.status(200).send(updatingUser);
    } catch (error) {
      res.status(400).send('Debes ingresar email y password para poder actualizar.')
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const { uid } = req.params;
      const validateUid = isEmailOrID(uid);
      const userAuth = req.headers.validated;
      const findUser = await Users.findOne (validateUid)
      if (findUser == null) {
        return res.status(404).send('No existe el usuario')
      } else if (!userAuth.roles.admin && !(userAuth.id === uid || userAuth.email === uid)) {
        return res.status(403).send('No es admin o la misma usuaria que desea actualizar sus datos.');
      }
      let userToDelete = await Users.findOneAndDelete(validateUid).select('-password');
      res.send(userToDelete);
    } catch (error) {
      console.log(error)
    }
  }
};