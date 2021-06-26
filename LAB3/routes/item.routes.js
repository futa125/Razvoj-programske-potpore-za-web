var express = require('express');
const { body, validationResult } = require('express-validator');
var router = express.Router();
const db = require('../db/index.js');

router.get('/:id([0-9]|[1-9][0-9])', async (req, res) => {
    try {
        let id = req.params.id;

        let [category, item, experts] = await Promise.all([
            db.query(`SELECT * FROM categories WHERE id=(SELECT categoryid FROM inventory WHERE id=${id})`),
            db.query(`SELECT * FROM inventory WHERE id=${id}`),
            db.query(`SELECT * FROM experts WHERE expertFor=${id}`)
        ])

        category = category.rows[0];
        item = item.rows[0]; 

        res.render('item', {
                title: item.name,
                linkActive: 'order',
                item: item,
                category: category,
                experts: experts
        })

    } catch (err) {
        console.log(err);
        res.status(404).send("Not found");
    }
});

router.get('/:item_id([0-9]|[1-9][0-9])/editexpert/:expert_id([0-9]|[1-9][0-9])', async (req, res) => {
    try {
        let expert_id = req.params.expert_id;
        let item_id = req.params.item_id;
        
        let [expert, item] = await Promise.all([
            db.query(`SELECT * FROM experts WHERE id=${expert_id}`),
            db.query(`SELECT * FROM inventory WHERE id=${item_id}`)
        ])

        expert = expert.rows[0];
        item = item.rows[0];

        res.render('edit-expert', {
                title: 'Edit expert',
                linkActive: '',
                expert: expert,
                item: item
        })

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }

});

router.post('/:item_id([0-9]|[1-9][0-9])/editexpert/:expert_id([0-9]|[1-9][0-9])',
            body('name').isLength({min: 3, max: 20}),
            body('surname').isLength({min: 3, max: 20}),
            body('email').isEmail(),
            body('employedsince').isInt({min: 1970, max: 2021}),
            body('expertsince').isInt({min: 1970, max: 2021}), async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render('error', {
            title: 'Edit Expert',
            linkActive: '',
            errors: errors.errors,
            itemID: req.params.item_id
        })

        return;
    }

    try {
        await db.query(`UPDATE experts SET name = '${req.body.name}', surname = '${req.body.surname}', email = '${req.body.email}', 
                        employedsince = ${req.body.employedsince}, expertsince = ${req.body.expertsince} WHERE id = ${req.params.expert_id}`);
        
        res.redirect(`/items/${req.params.item_id}`);

    } catch (err) {
        res.render('error', {
            title: 'Edit Expert',
            linkActive: '',
            errors: 'none',
            errDB: err.message,
            itemID: req.params.item_id
        })
    }
});

module.exports = router;