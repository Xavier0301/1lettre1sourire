
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
   var letter = getLetterFromBody(req.body);

   if(letter === undefined) {
      res.send({ message: 'could not add letter'});
   } else {
      letter.save(function(err) {
         if (err)
            res.send(err);
         else 
            res.json({ message: 'letter added' });
      });
   }
 });

function getLetterFromBody(body) {
   if(body === undefined) {
      return undefined;
   }

   var letter = new Letter();

   letter.id = parseInt(body.id);
   letter.submissionTime = body.submissionTime;
   letter.email = body.email;
   letter.type = body.type;
   letter.heading = body.heading;
   letter.content = body.content;
   letter.signature = body.signature;
   letter.imageUrl = body.imageUrl;
   letter.firstName = body.firstName;

   return letter;
}

 module.exports = router;