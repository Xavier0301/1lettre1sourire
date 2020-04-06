function listBatches() {
    var url = '/batches/list';

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
        .then(function(batches) {
            populateBatchesTable(batches);
        });
}

function populateBatchesTable(batches){
    var table = document.getElementById('batches-table');
    table.innerHTML = `
        <tbody><tr>
            <th scope="col">Index</th>
            <th scope="col">Type</th>
            <th scope="col">Nombre de lettre</th>
            <th scope="col">Deja téléchargé</th>
            <th scope="col">Telechargement</th>
        </tr>
        </tbody>`;    
    batches.forEach(function(batch) {
        var tr = document.createElement('tr');
        const downloadedLitteral = batch.downloaded ? "Oui" : "Non";
        tr.innerHTML = '<td>' + batch.index + '</td>' +
            '<td>' + batch.type + '</td>' +
            '<td>' + batch.letterCount + '</td>' +
            '<td>' + downloadedLitteral + '</td>' + 
            `<button type="" onClick='invoke' name='' data-arg1='${batch.type}' data-arg2='${batch.index}'>Télécharger</button>`;

        table.appendChild(tr);
    });
}

invoke = (event) => {
    let arg1 = event.target.getAttribute('data-arg1');
    let arg2 = event.target.getAttribute('data-arg2');

    downloadBatch(arg1, arg2);
}

function downloadBatch(type, index) {
    const params = {
        index: index,
        type: type
    }
    var url = formatUrl('/batches/download', params);

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let fetchOptions = {
        method: 'GET',
        header: headers
    }

    fetch(url, fetchOptions)
        .then((response) => response.text())
        .then((data) => console.log(data));
}

function formatUrl(url, params) {
    return url + '?' + objectToQueryString(params);
}

function objectToQueryString(obj) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
  }