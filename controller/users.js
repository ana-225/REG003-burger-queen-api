const Users = require("../Models/User");
const bcrypt = require("bcrypt");

module.exports = {
  getUsers: (req, res) => {
    Users.find()
      .then((users) => {
        const findAdmin = users.find((user) => user.roles.admin === true);
        if (!findAdmin) {
          return res.sendStatus(403);
        }
        res.status(200).send(users);
      })
      .catch(() => {
        res.sendStatus(401);
      });
  },
  getUser: async (req, res, next) => {
    try {
      const { uid } = req.params;
      const findUserById = await Users.findById(uid);
      if (!findUserById) {
        res.sendStatus(404);
      }
      res.status(200).send(findUserById);
    } catch (error) {
      return next(500);
    }
  },
  createUser: async (req, res, next) => {
    try {
      const { email, password, roles } = req.body;
      const user = {
        email,
        password: bcrypt.hashSync(password, 10),
        roles,
      };
      const verifyEmail = await Users.find({
        email: email
      });
      if (verifyEmail.lenght !== 0) {
        return res.status(403).send('Email ya registrado')
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
      res.status(400).send("Por favor, recuerda ingresar tu contraseña y password.");
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const { uid } = req.params;
      const { email, password, roles } = req.body;
      const user = await Users.findOne({ _id: uid});
      if (!user) {
        return res.status(404).send('No existe el usuario')
      }
      const updateRequest = {
        email: email || user.email,
        password: bcrypt.hashSync(password, 10) || user.password,
        roles: roles || user.roles
      };
      const updatingUser = await Users.findOneAndUpdate({ _id: uid }, updateRequest, { new: true });
      res.status(200).send(updatingUser);
    } catch (error) {
      res.sendStatus(500)
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const { uid } = req.params;
      let deleteById = await Users.findOneAndDelete({ _id: uid });
      if (deleteById == null) {
        return res.status(404).send('No existe el usuario')
      }
      res.send(deleteById);
    } catch (error) {
      console.log(error)
    }
  }
};