const express = require('express');
const router = express.Router();

const loginReq = require('../middleware/loginReq');
const adminReq = require('../middleware/adminReq');

router.get('/', loginReq, adminReq, function(req, res) {  
    res.sendFile('admin.html', { root: './src' });
});

module.exports = router;