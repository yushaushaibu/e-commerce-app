const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hi there, Enjoy..');
});

app.listen(3000, () => {
    console.log('Listening..')
})