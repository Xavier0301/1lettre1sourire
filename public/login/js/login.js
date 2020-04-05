/*login script*/
// DOCTYPE javascript>

fetch(./app/middleware/loginReq.js)
    .then(function(response){
        if (response.status !== 401){
            //good login go to reviewer window
            window.location = "reviewer.html";
            return;
        } else {
            var m = document.getElementById("login-error-message");
            m.innerHTML = "Erreur, mauvais mot de passe ou username.";
        }
}).catch(function(err){
    //if the server returns some errors
    console.log('Fetch error ', err);
});