function getStats() {
    var url = '/stats/';

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let fetchOptions = {
        method: 'GET',
        headers: headers,
        credentials: 'include'
    }

    fetch(url, fetchOptions)
        .then((response) => response.json())
        .then(function(stats) {
            populateStatFields(stats);
        });
}

function populateStatFields(stats) {
    document.getElementById('queued-count').innerHTML = stats.queuedCount;
    document.getElementById('in-review-count').innerHTML = stats.inReviewCount;
    document.getElementById('accepted-count').innerHTML = stats.acceptedCount;
    document.getElementById('rejected-count').innerHTML = stats.rejectedCount;
}