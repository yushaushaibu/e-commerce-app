const express = require('express');

const router = express.Router();

router.get('/admin/products', (req, res) => {
    res.send('Hello world')
});

router.get('/admin/products/new', (req, res) => {

});

module.exports = router;