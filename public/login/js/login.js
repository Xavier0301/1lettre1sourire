/*login script*/
function loginFct() {
    var url = 'http://localhost:3000/login/fetch';
    var resp;
    
    fetch(url)
        .then(function (response) {
            resp = response.json();
        });
    
    if (resp.status !== 401) {
            window.location.href = "reviewer.html";
    } else {
            var m = document.getElementById("login-error-message");
            m.innerHTML = "Erreur, mauvais mot de passe ou username.";
    }
}
