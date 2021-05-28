var express = require('express');
var router = express.Router();
const db = require('../db/index.js');

router.get('/:id([0-9]|[1-9][0-9])', async (req, res) => {
    try {
        let id = req.params.id;

        let [category, item] = await Promise.all([
            db.query(`SELECT * FROM categories WHERE id=(SELECT categoryid FROM inventory WHERE id=${id})`),
            db.query(`SELECT * FROM inventory WHERE id=${id}`)
        ])

        category = category.rows[0];
        item = item.rows[0]; 

        res.render('item', {
                title: item.name,
                linkActive: 'order',
                item: item,
                category: category
        })

    } catch (err) {
        console.log(err);
        res.status(404).send("Not found");
    }

})

module.exports = router;