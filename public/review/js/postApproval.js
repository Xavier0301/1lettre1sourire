// Sends the id and 2 booleans as a POST request

function postApproval(approved, flagged) {
  if(approvalContext.currentId) {
    var url = '/review/approve';

    let data = {
      id: approvalContext.currentId,
      flag: flagged,
      approve: approved
    }

    console.log("Payload that will be sent to approve");
    console.log(data);

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let fetchOptions = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: headers,
      credentials: 'include',
      mode: 'cors'
    }

    fetch(url, fetchOptions)
      .then(function(response) {
        approvalContext.localCounter += 1;
      })
      .catch(function(reason) {
        alert("Cannot fetch letter.");
      });
  } else {
    alert("Nothing to approve.");
  }
}
