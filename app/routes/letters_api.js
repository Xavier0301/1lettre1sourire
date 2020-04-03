
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Letter = require('../models/letter');

// sample api route
// grab the reviewer model we just created
router.get('/letters/list', function(req, res) {
   // use mongoose to get all letters in the database
   Letter.find(function(err, letters) {
      // if there is an error retrieving, send the error.
      // nothing after res.send(err) will execute
      if (err)
         res.send(err);
      res.json(letters); // return all letters in JSON format
   });
});

router.post('/letters/add', function (req, res) {
    var letter = new Letter(); // create a new instance of the letter model
    letter.content = req.body.content; // set the letter content (comes from the request)
    letter.save(function(err) {
       if (err)
          res.send(err);
          res.json({ message: 'letter added' });
    });
 });

 module.exports = router;