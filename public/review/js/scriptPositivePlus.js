// Sends the id and 2 booleans as a POST request

var http = new XMLHttpRequest();
var url = "/review/approve";
http.open('POST', url, true);

http.setRequestHeader("Conent-Type",'application/json;charset=UTF-8');
http.send(JSON.stringify({"id": content[2], "flag": true, "approve": true}));
