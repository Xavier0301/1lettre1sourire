

var jsonBatch = '{"index":["F45", "H8", "H6"], "nbDoc":["6", "85", "100"], "type":["F", "H", "H"], "dwnld":["true", "false", "true"]}';

var batch = JSON.parse(jsonBatch);
var batchs_data = '';
.each(jsonBatch, function (key, value) {
    batchs_data += '<tr>';
    batchs_data += '<td>'+value.index+'</td>';
    batchs_data += '<td>'+value.nbDoc+'</td>';
    batchs_data += '<td>'+value.type+'</td>';
    batchs_data += '<td>'+value.dwnld+'</td>';
    batchs_data += '</tr>';
    //("<tr><td>" + index + "</td><td>" + type + "</td><td>" + nbDoc + "</td><td>" + dwnldDate + "</td></tr>").appendTo("#batchs")
});

('#batch_table').append(batchs_data);