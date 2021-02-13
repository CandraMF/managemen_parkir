const express = require('express')
const router = express.Router()
const userController =   require('../controllers/user.controller');

router.get('/', userController.findAll);

router.post('/', userController.create);

router.get('/:id', userController.findById);

router.put('/', userController.update);

router.put('/editRole', userController.editRole);

router.put('/changePassword', userController.changePassword);

router.delete('/:id', userController.delete);

module.exports = router