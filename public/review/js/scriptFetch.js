
//var content; //[id,type,greeting,content,signature,imageUrl,exists]

// Subfields are 
//  - localCounter, currentId, lastId
var approvalContext = {
  localCounter: 0
};

function funcFetch() {
  const url = '/review/fetch'

  const fetchOptions = { credentials: 'include', mode: 'cors' };

  fetch(url, fetchOptions)
    .then((response) => response.json())
    .then(function(data) {
      approvalContext.lastId = approvalContext.currentId;

      if(data.exists) {
        approvalContext.currentId = data.id;
        populatePage(data);
      } else {
        approvalContext.currentId = undefined;
        displayLetter("Toi et l'équipe avez réussi a relire toutes les lettres en attente!", "Wow,", "Merci pour ta contribution de " + approvalContext.localCounter + " lettres :)");
      }
    });
};

function populatePage(data) {
  let contentLetter = data.content;
  let contentImage = data.imageUrl;
  let greetingLetter = data.greeting;
  let signatureLetter = data.signature;

  displayLetter(contentLetter,greetingLetter,signatureLetter);
  displayImage(contentImage);
}