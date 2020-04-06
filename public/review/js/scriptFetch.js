
//var content; //[id,type,greeting,content,signature,imageUrl,exists]
var idToPost;
function funcFetch() {
  var url = 'http://localhost:3000/review/fetch';

  fetch(url)
    .then((response) => response.json())
    .then(function(data) {
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
    });
  };
