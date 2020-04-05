/*login script*/
function loginFct() {
    var url = 'http://localhost:3000/login/fetch';
    var resp;
    
    fetch(url)
        .then(function (response) {
            resp = response.json();
        });
    
    if (response.status == 401) {//resp or response ?
            var m = document.getElementById("login-error-message");
            m.innerHTML = "Erreur, mauvais mot de passe ou username.";
    }
}