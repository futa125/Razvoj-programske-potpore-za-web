var express = require('express');
var router = express.Router();
const db = require('../db/index.js');

router.get('/', async (req, res) => {

    let categories = await db.query('SELECT * FROM categories');

    for (category of categories.rows) {
        let items = await db.query(`SELECT * FROM inventory WHERE categoryid=${category.id}`);
        category.items = items.rows;
    }

    res.render('order', {
        title: 'Order',
        linkActive: 'order',
        categories: categories
    })

});

module.exports = router;