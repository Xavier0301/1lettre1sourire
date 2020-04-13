
//var content; //[id,type,greeting,content,signature,imageUrl,exists]
var lastId;
var currentId;
var localCounter = 0;

function funcFetch() {
  const url = '/review/fetch'

  const fetchOptions = {credentials: 'include', mode: 'cors'};

  fetch(url, fetchOptions)
    .then((response) => response.json())
    .then(function(data) {
      if(data.exists) {
        localCounter += 1;
        let contentLetter = data.content;
        let contentImage = data.imageUrl;
        let greetingLetter = data.greeting;
        let signatureLetter = data.signature;

        lastId = currentId;
        currentId = data.id;

        console.log(contentLetter);
        console.log(contentImage);
        console.log(data);
        displayLetter(contentLetter,greetingLetter,signatureLetter);
        displayImage(contentImage);
      } else {
        displayLetter("Toi et l'équipe avez réussi a relire toutes les lettres en attente!", "Wow,", "Merci pour ta contribution de " + localCounter + " lettres :)")
      }
    });
};
