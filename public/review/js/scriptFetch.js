
//var content; //[id,type,greeting,content,signature,imageUrl,exists]
var idToPost;
var localCounter = 0;
function funcFetch() {
  var url = 'http://localhost:3000/review/fetch';

  fetch(url)
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
        displayLetter(" il n'y a actuellement plus de lettre à passer en revue.", "Hey,", "Nous te remercions pour votre collaboration de " + localCounter + " lettres !")
      }
    });
};
