 function funcLogin() {
   var url = '/login';

    let data = {
      password: document.getElementById("password").value,
      username: document.getElementById("username").value

    }

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let fetchData = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: myHeaders,
      redirect: 'follow'
    }

    fetch(url, fetchData)
      .then(function(response){
        console.log(fetchData);
        console.log(response);
        if(response.status == 200){
          console.log("welcome");
          window.location.replace(response.url);
        } else {
          console.log("error not 200")
          window.location.replace("/");
          alert("Verfiez votre mot de passe et votre identifiant.");
        }
      });


}
