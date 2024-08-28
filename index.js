const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());


const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});


app.get('/api/products', (req, res) => {
    res.send('List of products');
});

app.post('/api/products', (req, res) => {
    res.send('Product created');
});
