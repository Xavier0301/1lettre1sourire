function postUndo() {
  if(approvalContext.lastId) {
    var url = '/review/undo';
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');


    let data = {
      lastId: approvalContext.lastId
    }
    if(approvalContext.currentId) {
      data.currentId = approvalContext.currentId;
    }

    let fetchOptions = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: myHeaders,
      credentials: 'include',
      mode: 'cors'
    }

    fetch(url, fetchOptions)
      .then((response) => response.json())
      .then(function(data) {
        if(data.exists) {
          approvalContext.lastId = undefined;
          approvalContext.currentId = data.id;
        
          approvalContext.localCounter -= 1;

          populatePage(data);
        }
      })
      .catch(function(reason) {
        alert("Cannot undo. You have 30 seconds to undo a letter.");
      });
  } else {
    alert("Nothing to undo. (You cannot undo two letters in a row).");
  }
}
