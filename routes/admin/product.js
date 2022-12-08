const express = require('express');
const { validationResult } = require('express-validator');
const productRepo = require('../../repositories/products');
const newProductTemplate = require('../../views/admin/products/newProduct');
const { requireProduct, requirePrice } = require('./validators');

const router = express.Router();

router.get('/admin/products', (req, res) => {
});

router.get('/admin/products/new', (req, res) => {
    res.send(newProductTemplate({}));
});

router.post('/admin/products/new', [requireProduct, requirePrice], (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    res.send('Product uploaded');
})

module.exports = router;