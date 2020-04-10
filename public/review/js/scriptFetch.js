
//var content; //[id,type,greeting,content,signature,imageUrl,exists]
var idToPost;
var localCounter = 0;
function funcFetch() {
  const url = '/review/fetch'

  fetch(url, {credentials: 'include'})
    .then((response) => response.json())
    .then(function(data) {
      if(data.exists) {
        localCounter += 1;
        let contentLetter = data.content;
        let contentImage = data.imageUrl;
        let greetingLetter = data.greeting;
        let signatureLetter = data.signature;
        idToPost = data.id;
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
