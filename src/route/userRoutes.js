const express = require('express');

const route = express.Router();

const userController = require('../controller/userController');

route.use(express.json());

route.post('/register', userController.register);

route.get('/users',userController.getUsers);
route.get("/users/:id",userController.getUserById);

route.put("/users/:id",userController.updateUser);

route.delete("/users/:id",userController.deleteById);

module.exports = route;






