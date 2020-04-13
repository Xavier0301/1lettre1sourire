
//var content; //[id,type,greeting,content,signature,imageUrl,exists]

// Subfields are 
//  - localCounter, currentId, lastId
var approvalContext = {};

function funcFetch() {
  const url = '/review/fetch'

  const fetchOptions = {credentials: 'include', mode: 'cors'};

  fetch(url, fetchOptions)
    .then((response) => response.json())
    .then(function(data) {
      if(data.exists) {
        approvalContext.lastId = approvalContext.currentId;
        approvalContext.currentId = data.id;
        
        populatePage(data);
      } else {
        displayLetter("Toi et l'équipe avez réussi a relire toutes les lettres en attente!", "Wow,", "Merci pour ta contribution de " + approvalContext.localCounter + " lettres :)")
      }
    });
};

function populatePage(data) {
  let contentLetter = data.content;
  let contentImage = data.imageUrl;
  let greetingLetter = data.greeting;
  let signatureLetter = data.signature;

  console.log(contentLetter);
  console.log(contentImage);
  console.log(data);
  displayLetter(contentLetter,greetingLetter,signatureLetter);
  displayImage(contentImage);
}