const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')


router.get('/', function (req, res, next) {
    //####################### ZADATAK #######################
    //vrati login stranicu

    res.render('login', { err: undefined, linkActive: 'login', user: req.session.user });

    //#######################################################

});

router.post('/', function (req, res, next) {
    //####################### ZADATAK #######################
    //postupak prijave korisnika

    (async () => {
    
        if( req.session.user !== undefined ) {
            res.render('login', { user: req.session.user, err: "Please log out first.", linkActive: 'login' });
            return;
        }

        let user = await User.fetchByUsername(req.body.user);

        if( user.isPersisted() && user.checkPassword(req.body.password) ) {

            req.session.user = user;

            res.redirect('/');
        
        } else {
            res.render('login', { user: req.session.user, err: "Incorrect username or password.", linkActive: 'login' });
        }
        
    })()

    //#######################################################

});


module.exports = router;