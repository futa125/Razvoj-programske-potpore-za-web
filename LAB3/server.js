const express = require('express');
const app = express()
let path = require('path')

const homeRouter = require('./routes/home.routes');
const orderRouter = require('./routes/order.routes');
const itemRouter = require('./routes/item.routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/order', orderRouter);
app.use('/items', itemRouter);

app.listen(3000);