

function postUndo() {
  if(lastId) {
    var url = '/review/undo';
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let data = {
      lastId: lastId,
      currentId: currentId
    }

    let fetchOptions = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: myHeaders,
      credentials: 'include',
      mode: 'cors'
    }

    console.log(fetchOptions)

    fetch(url, fetchData)
      .then(function(resp) {
        console.log(resp);
      })
  } else {
    alert("Nothing to undo.");
  }
}
