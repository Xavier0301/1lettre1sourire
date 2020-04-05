var http = new XMLHttpRequest;
var url = '/review/fetch';
var data;
var content = []; //[id,type,greeting,content,signature,imageUrl,exists]

fetch(url)
  .then(function(response) {
    data = response.json();
  })

for (var i = 0; i < data.results.length; i++)
{
  content.push(data.results[i].value);
}
