function addUser() {
    var url = '/user/register';
 
    console.log(document.getElementById("admin-checkBox").checked);
    let data = {
        username: document.getElementById("add user username").value,
        password: document.getElementById("add user password").value,
        admin: document.getElementById("admin-checkBox").checked
    }
 
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
 
    let fetchOptions = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: headers
    }
 
    fetch(url, fetchOptions)
        .then(function(response){
            if(response.status === 200) {
                listUsers();
                // alert("Utilisateur ajouté");
            } else {
                alert("Erreur durant l'ajout d'un utilisateur");
            }
        }); 
}
 
function removeUser() {
    var url = '/user/remove';
 
    let data = {
        username: document.getElementById("remove user username").value,
    }
 
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
 
    let fetchOptions = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: headers
    }
 
    fetch(url, fetchOptions)
        .then(function(response){
            if(response.status === 200) {
                listUsers();
                // alert("Utilisateur supprimé");
            } else {
                alert("Erreur durant la suppression d'un utilisateur");
            }
        });
}

function listUsers() {
    var url = '/user/list';

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let fetchOptions = {
        method: 'GET',
        headers: headers
    }

    fetch(url, fetchOptions)
        .then((response) => {
            console.log(response);
            return response.json()
        })
        .then(function(users) {
            populateUserTable(users);
        });
}

function populateUserTable(users){
    var table = document.getElementById('users-table');
    table.innerHTML = `<caption>Utilisateurs</caption>
    <tbody><tr>
     <th scope="col">Identifiant</th>
     <th scope="col">Admin</th>
    </tr>
   </tbody>`;    
    users.forEach(function(user) {
        var tr = document.createElement('tr');
        const adminLitteral = user.isAdmin ? "Oui" : "Non";
        tr.innerHTML = '<td>' + user.username + '</td>' +
            '<td>' + adminLitteral + '</td>'
        table.appendChild(tr);
    });
}


// var jsonBatch = '{"index":["F45", "H8", "H6"], "nbDoc":["6", "85", "100"], "type":["F", "H", "H"], "dwnld":["true", "false", "true"]}';

// var batch = JSON.parse(jsonBatch);
// var batchs_data = '';
// .each(jsonBatch, function (key, value) {
//     batchs_data += '<tr>';
//     batchs_data += '<td>'+value.index+'</td>';
//     batchs_data += '<td>'+value.nbDoc+'</td>';
//     batchs_data += '<td>'+value.type+'</td>';
//     batchs_data += '<td>'+value.dwnld+'</td>';
//     batchs_data += '</tr>';
//     //("<tr><td>" + index + "</td><td>" + type + "</td><td>" + nbDoc + "</td><td>" + dwnldDate + "</td></tr>").appendTo("#batchs")
// });

// ('#batch_table').append(batchs_data);