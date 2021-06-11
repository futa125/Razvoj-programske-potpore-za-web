const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const authHandler = require('./helpers/auth-handler');


router.get('/', authHandler, function (req, res, next) {

    let courier = req.session.courier;

    res.render('courier', { 
        courier: courier,
        err: undefined, 
        linkActive: 'login', 
        user: req.session.user,
        title: 'Courier' 
    });

});

router.post('/order', authHandler, function (req, res, next) {

    req.session.courier = undefined;
    res.redirect('/checkout');

});

router.post('/save', authHandler, function (req, res, next) {

    req.session.courier = req.body;
    res.redirect('/cart');

});

router.post('/reset', authHandler, function (req, res, next) {

    req.session.courier = undefined;
    res.redirect('/courier');
    
});


module.exports = router;