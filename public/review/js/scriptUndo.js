

function postUndo() {
  var url = '/review/approve';
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  let data = {
    lastId: idToPost,
    currentId: "TO REPLACE"
  }

  let fetchData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: myHeaders,
    credentials: 'include',
    mode: 'cors'
  }

  console.log(fetchData)

  fetch(url, fetchData)
    .then(function(resp) {
      console.log(resp);
    })
}
