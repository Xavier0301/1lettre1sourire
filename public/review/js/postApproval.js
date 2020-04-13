// Sends the id and 2 booleans as a POST request

function postApproval(approved, flagged) {
  if(currentId) {
    var url = '/review/approve';
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let data = {
      id: currentId,
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
      .then(function(resp) {
        console.log(resp);
      })
  } else {
    alert("Nothing to approve.");
  }
}
