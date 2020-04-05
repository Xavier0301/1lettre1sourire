var http = new XMLHttpRequest;
var url = '/review/fetch';
var data;
var content = [];
var id;
var type;
var greeting;
var content;
var signature;
var imageUrl;
var exists;

http.open('GET',url);

// http.onload = function() {
//   alert('Loaded: ${http.status} ${http.response}');
// }
http.send();

fetch(url)
  .then(function(response) {
    data = response.json();
  })

for (var i = 0; i < data.results.length; i++)
{
  content.push(data.results[i].value);
}
