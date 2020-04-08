const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.sendFile('login.html', { root: './src' });
});

module.exports = router;