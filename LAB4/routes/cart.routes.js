const express = require('express');
const router = express.Router();
const cart = require('../models/CartModel')
const cartSanitizer = require('./helpers/cart-sanitizer');

// Ulančavanje funkcija međuopreme
router.get('/', cartSanitizer, function (req, res, next) {
    //####################### ZADATAK #######################
    // prikaz košarice uz pomoć cart.ejs
    (async () => {

        res.render('cart', { user: req.session.user, linkActive: 'cart', title: 'Flower power!', cart: req.session.cart, err: undefined });

    })()

    //#######################################################
});


router.get('/add/:id', function (req, res, next) {
    //####################### ZADATAK #######################
    //dodavanje jednog artikla u košaricu

    (async () => {
        if( req.session.cart === undefined || req.session.cart.invalid === true) {
            req.session.cart = cart.createCart();
        }

        await cart.addItemToCart(req.session.cart, req.params.id.toString(), 1);
        res.redirect("/");

    })()

    //#######################################################


});

router.get('/remove/:id', function (req, res, next) {
    //####################### ZADATAK #######################
    //brisanje jednog artikla iz košaricee

    (async () => {
        if( req.session.cart === undefined || req.session.cart.invalid === true) {
            req.session.cart = cart.createCart();
        }

        await cart.removeItemFromCart(req.session.cart, req.params.id.toString(), 1);
        res.redirect("/");

    })()

    //#######################################################


});

module.exports = router;
