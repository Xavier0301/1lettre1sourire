const express = require('express');
const router = express.Router();
const Letter = require('../models/letter');

const apikeyReq = require('../middleware/apikeyReq');

router.get('/list', apikeyReq, function(req, res) {
   Letter.model.find(function(err, letters) {
      if (err)
         res.send(err);
      res.json(letters); // return all letters in JSON format
   });
});

router.post('/add', apikeyReq, function (req, res, next) {
   var letter = getLetterFromBody(req.body);
   letter.save(function(err) {
      if (err)
         res.send(err);
      else 
         res.json({ message: 'letter added' });
   });
 });

function getLetterFromBody(body) {
   var letter = new Letter.model();

   letter.id = parseInt(body.id);
   letter.submissionTime = body.submissionTime;
   letter.email = body.email;
   letter.type = body.type === Letter.expectedTypeValues.male ? Letter.typeValues.male : Letter.typeValues.female;
   letter.heading = body.heading;
   letter.content = body.content;
   letter.signature = body.signature;
   letter.imageUrl = body.imageUrl;
   letter.firstName = body.firstName;

   return letter;
}

 module.exports = router;