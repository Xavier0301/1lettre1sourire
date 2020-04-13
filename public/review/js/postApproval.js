// Sends the id and 2 booleans as a POST request

function postApproval(approved, flagged) {
  if(currentId) {
    var url = '/review/approve';
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let data = {
      id: approvalContext.currentId,
      flag: flagged,
      approve: approved
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
        approvalContext.localCounter += 1;
      })
      .catch(function(reason) {
        alert("Cannot fetch letter.");
      });
  } else {
    alert("Nothing to approve.");
  }
}
