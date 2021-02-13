'use strict';
const model = require('../models/index');

import bcryptjs from 'bcryptjs'

var salt = 10;

exports.findAll = async function(req, res) {

    await model.user.findAndCountAll().then((data) => {
            
        model.user.findAll().then((users) => {
            res.status(200).json({
                'sucess': 1,
                'data': users,
                'count': data.count, 
            });
        });    

    }).catch(function (err) {
        res.status(400).json({
            'success': 0,
            'messages': err.message,
            'data': {},
        });
    });        
};

exports.create = async function(req, res) {    
    var {       
        name,
        email,
        password,
        role
    } = req.body;
    
    await bcryptjs.hash(password, salt, function(err, hash){
        model.user.create({
            name,        
            email,
            role,
            password: hash
        }).then((user) => {
            res.status(200).json({
                'success' : 1,
                'messages': 'user berhasil ditambahkan',
                'data': user,
            })
        }).catch(function(err) {
            res.status(400).json({
                'success': 0,
                'messages': err.message,
                'data': {},
            })
        });                 
    })

};

exports.findById = async function(req, res) {
      
    await model.user.findOne({
        attributes: ['id', 'name', 'email'],
        where: {
            id: req.params.id
        },
    }).then((user) => {
        res.json({
            'success': 1,
            'messages': 'user ditemukan',
            'data': user,
        })
    }).catch(function(err) {
        res.status(400).json({
            'success': 0,
            'messages': err.message,
            'data': {},
        })
    }); 

};

exports.changePassword = async function(req, res) {
    var {
        id,
        oldPassword,
        newPassword
    } = req.body

    await model.user.findOne({
        attributes: ['id', 'password'],
        where: {
            id: id
        },
    }).then((user) => {
        bcryptjs.compare(oldPassword, user.password, function (err, result) {
            if (result == true) {
                bcryptjs.hash(newPassword, salt, function(err, hash){
                    model.user.update({        
                        password: hash
                    }, {
                        where: {
                            id: id
                        }
                    }).then((user) => {
                        res.status(200).json({
                            'success': 1,
                            'messages': 'Password berhasil diupdate',
                            'data': user,
                        })
                    }).catch(function(err) {
                        res.status(400).json({
                            'success': 0,
                            'messages': err.message,
                            'data': {},
                        })            
                    })  
                })
            } else {
                res.status(400).json({
                    'success': 0,
                    'data': null,
                    'message': 'Password Lama Tidak Valid',
                    'error': err
                })
            }
        })
    }).catch(function(err) {
        
    }); 
};

exports.update = async function(req, res) {
    var {   
        id,     
        name,    
        email,    
    } = req.body;

    await model.user.findOne({
        where: {
            id: id
        },
    }).then((user) => {

        model.user.update({        
            name: name, 
            email: email,
        }, {
            where: {
                id: id
            }
        }).then((user) => {
            res.json({
                'success': 1,
                'messages': 'user berhasil diupdate',
                'data': user,
            })
        }).catch(function(err) {
            res.status(400).json({
                'success': 0,
                'messages': err.message,
                'data': {},
            })            
        }) 

    }).catch(function(err) {
        
    }); 
    
   
};

exports.delete = async function(req, res) {
    const id = req.params.id;
    
    await model.user.destroy({ where: {
        id: id
    }}).then((user) => {
        res.json({
            'success': 1,
            'messages': 'user berhasil dihapus',
            'data': user,
        })        
    }).catch(function(err){
        res.status(400).json({
            'success': 0,
            'messages': err.message,
            'data': {},
        })
    });              
};

exports.editRole = async function(req, res) {

    var {   
        id,     
        role 
    } = req.body;

    model.user.update({        
        role: role
    }, {
        where: {
            id: id
        }
    }).then((user) => {
        res.json({
            'success': 1,
            'messages': 'user berhasil diupdate',
            'data': user,
        })
    }).catch(function(err) {
        res.status(400).json({
            'success': 0,
            'messages': err.message,
            'data': {},
        })            
    })  
};



