const express = require('express');
const router = express.Router();
const Letter = require('../models/letter');

const logger = require('log4js').getLogger('runtime');

const apikeyReq = require('../middleware/apikeyReq');

router.get('/count', apikeyReq, function(req, res) {
   Letter.model.countDocuments({}, function(err, count) {
      if(err) {
         logger.error(err);
         res.send(err);
      } else {
         res.send(count);
      }
   })
})

router.get('/list', apikeyReq, function(req, res) {
   Letter.model.find(function(err, letters) {
      if(err) {
         logger.error(err);
         res.send(err);
      } else { 
         res.json(letters); 
      }
   });
});

router.post('/add', apikeyReq, function (req, res, next) {
   var letter = getLetterFromBody(req.body);
   letter.save(function(err) {
      if(err) {
         logger.error(err);
         res.send(err);
      } else {
         res.json({ message: 'letter added' });
      }
   });
 });

function getLetterFromBody(body) {
   var letter = new Letter.model();

   letter.id = parseInt(body.id);
   letter.submissionTime = body.submissionTime;
   letter.email = body.email;
   letter.type = getTypeValue(body.type);
   letter.heading = body.heading;
   letter.content = body.content;
   letter.signature = body.signature;
   letter.imageUrl = body.imageUrl;
   letter.firstName = body.firstName;

   return letter;
}

function getTypeValue(type) {
   if(type === Letter.typeValues.male || type === Letter.typeValues.female) {
      return type;
   } else if(type === Letter.expectedTypeValues.male) {
      return Letter.typeValues.male;
   } else if(type === Letter.expectedTypeValues.female) {
      return Letter.typeValues.female;
   } else {
      logger.error("Type " + type + " does not correspond to a registered type");
      return Letter.typeValues.male;
   }
}

 module.exports = router;