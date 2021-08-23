const bcrypt = require('bcrypt');
const Users = require('../Models/User');
const { requireAdmin } = require('../middleware/auth');

module.exports = {

  // GET "Lista de usuarios" - '/users'
  getUsers: async (req, res, next) => {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };

      const allUsers = await Users.paginate({}, options);
      return res.status(200).json(allUsers);
    } catch (error) {
      return next(500);
    }
  },

  // GET "Busqueda de un usuario segun el id entregado" - '/users/:uid'

  getUser: async (req, res, next) => {
    try {
      const { uid } = req.params;
      const findUserById = await Users.findById(uid);
      if (!findUserById) {
        res.sendStatus(404);
      } else if (req.headers.validated._id !== uid && req.headers.validated.roles.admin === false) {
        return res.status(403).send('No es admin o la misma usuaria que desea ver sus datos');
      }
      res.status(200).send(findUserById);
    } catch (error) {
      return next(500);
    }
  },

  // POST "Crear usuario" - '/users'

  createUser: async (req, res) => {
    try {
      const {
        email,
        password,
        roles,
      } = req.body;
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
      const {
        uid,
      } = req.params;
      const {
        email,
        password,
        roles,
      } = req.body;
      const user = await Users.findOne({
        _id: uid,
      });
      if (!user) {
        return res.status(404).send('No existe el usuario');
      } else if (req.headers.validated._id !== { uid } && req.headers.validated.roles.admin === false) {
        return res.status(403).send('No es admin o la misma usuaria que desea actualizar sus datos');
      } else if (roles.admin !== user.roles.admin) {
        requireAdmin;
      }
      const updateRequest = {
        email: email || user.email,
        password: bcrypt.hashSync(password, 10) || user.password,
        roles: roles || user.roles,
      };
      const updatingUser = await Users.findOneAndUpdate({
        _id: uid
      }, updateRequest, {
        new: true
      });
      res.status(200).send(updatingUser);
    } catch (error) {
      res.sendStatus(500)
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const {
        uid
      } = req.params;
      let deleteById = await Users.findOneAndDelete({
        _id: uid
      });
      if (deleteById == null) {
        return res.status(404).send('No existe el usuario')
      }
      res.send(deleteById);
    } catch (error) {
      console.log(error)
    }
  }
};