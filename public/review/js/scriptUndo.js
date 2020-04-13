

function postUndo() {
  if(lastId) {
    var url = '/review/undo';
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let data = {
      lastId: approvalContext.lastId,
      currentId: approvalContext.currentId
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
      .then((response) => response.json())
      .then(function(data) {
        if(data.exists) {
          approvalContext.lastId = undefined;
          approvalContext.currentId = data.id;

          populatePage(data);
        }
      })
      .catch(function(reason) {
        alert("Cannot undo. You have 30 seconds to undo a letter.");
        alert(reason);
      });
  } else {
    alert("Nothing to undo.");
  }
}
