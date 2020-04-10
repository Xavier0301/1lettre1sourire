// Sends the id and 2 booleans as a POST request

function postPositive() {
  var url = '/review/approve';
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  let data = {
    id: idToPost,
    flag: "false",
    approve: "true"
  }

  let fetchData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: myHeaders,
    credentials: 'include'
  }

  console.log(fetchData)

  fetch(url, fetchData)
    .then(function(resp) {
      console.log(resp);
    })
}
