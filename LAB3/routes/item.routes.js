var express = require('express');
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

})

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
        res.status(404).send("Not found");
    }

})

router.post('/:item_id([0-9]|[1-9][0-9])/editexpert/:expert_id([0-9]|[1-9][0-9])', async (req, res) => {
    class validationError {
        constructor(msg, param) {
            this.msg = msg;
            this.param = param;
        }
    }

    let errors = [];
    let errDB = '';
    const item_id = req.params.item_id;
    const expert_id = req.params.expert_id;

    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/
    let empSince = req.body.employedsince;
    let expSince = req.body.expertsince;

    if (!(name.length >= 3 && name.length <= 20)) {
        errors.push(new validationError("Invalid value", name));
    }

    if (!(surname.length >= 3 && surname.length <= 20)) {
        errors.push(new validationError("Invalid value", surname));
    }

    try {
        empSince = parseInt(empSince)

        if (!(empSince >= 1970 && empSince <= 2021)) {
            throw err
        }

    } catch (err) {
        errors.push(new validationError("Invalid value", empSince));
    }

    try {
        expSince = parseInt(expSince)

        if (!(expSince >= 1970 && expSince <= 2021)) {
            throw err
        }

    } catch (err) {
        errors.push(new validationError("Invalid value", expSince));
    }

    if (!(emailRegex.test(email))) {
        errors.push(new validationError("Invalid value", email));
    }

    if (errors.length === 0) {
        try {
            await db.query(`UPDATE experts SET name = '${name}', surname = '${surname}', email = '${email}', 
            employedsince = ${empSince}, expertsince = ${expSince} WHERE id = ${expert_id}`);
    
        } catch (err) {
            errDB = err.message;
        }
    }

    if (errors.length !== 0 || errDB !== '') {
        res.render("error", {
            title: "Edit Expert",
            linkActive: '',
            errors: errors.length === 0 ? 'none' : errors,
            errDB: errDB,
            itemID: item_id
        })

    } else {
        res.redirect(`/items/${item_id}`);
    }

})

module.exports = router;