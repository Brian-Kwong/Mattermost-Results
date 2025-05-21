/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 64.61764705882354, "KoPercent": 35.38235294117647};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5669117647058823, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.045, 500, 1500, "Login"], "isController": false}, {"data": [0.6975, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.26, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.525, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.365, 500, 1500, "Post File"], "isController": false}, {"data": [0.84, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.085, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.065, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.645, 500, 1500, "Logout"], "isController": false}, {"data": [0.98, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.065, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.065, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3400, 1203, 35.38235294117647, 887.1811764705867, 0, 17042, 9.0, 3117.1000000000017, 7217.399999999994, 13850.149999999981, 44.84364077605877, 119.50117992768962, 95.23196795163481], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 200, 0, 0.0, 16.87000000000001, 2, 84, 12.0, 36.0, 46.0, 81.8900000000001, 9.995002498750626, 20.701563280859567, 5.368409545227386], "isController": false}, {"data": ["Get User Data", 200, 0, 0.0, 10.555, 3, 90, 8.0, 13.0, 20.94999999999999, 84.99000000000001, 9.982032341784787, 36.53531065956278, 5.010512327809942], "isController": false}, {"data": ["Get Channels", 200, 0, 0.0, 5.1000000000000005, 2, 60, 4.0, 8.0, 10.0, 22.940000000000055, 10.006003602161297, 8.061477511506904, 5.374318341004603], "isController": false}, {"data": ["Login", 200, 0, 0.0, 8386.145, 179, 17042, 8284.5, 15019.300000000001, 16103.999999999998, 16972.370000000003, 9.552923194497517, 13.714741877029995, 4.860282900864539], "isController": false}, {"data": ["Delete Msg on Main", 200, 47, 23.5, 935.4399999999999, 0, 7694, 42.0, 4635.8, 6101.149999999998, 7446.410000000001, 7.8737057596157625, 5.7910183162080235, 3.4638538467973703], "isController": false}, {"data": ["Delete File on Main", 200, 137, 68.5, 725.5099999999996, 0, 8534, 3.5, 2198.800000000001, 5602.099999999999, 8086.810000000002, 7.905763301446754, 13.908430261285478, 1.4342706809826864], "isController": false}, {"data": ["Upload Bee File", 200, 90, 45.0, 1249.5999999999992, 0, 8966, 10.5, 6674.700000000002, 8031.249999999999, 8850.85, 7.87897888433659, 10.67717053557359, 225.34572097581153], "isController": false}, {"data": ["Get Bee Movie File", 200, 0, 0.0, 11.164999999999997, 3, 101, 8.0, 21.80000000000001, 29.0, 71.71000000000026, 9.986019572598362, 213.1976170860795, 5.275816981226283], "isController": false}, {"data": ["Get Stats on TownCentre", 200, 0, 0.0, 6.4250000000000025, 2, 66, 4.0, 11.900000000000006, 16.0, 47.940000000000055, 9.986019572598362, 4.64193878570002, 5.363584731376074], "isController": false}, {"data": ["Post File", 200, 112, 56.0, 980.5400000000003, 0, 9196, 69.0, 4388.400000000001, 7093.099999999999, 8507.220000000005, 7.883948281299276, 14.539648252719964, 3.099839118180385], "isController": false}, {"data": ["Update Msg to Main", 200, 22, 11.0, 597.34, 10, 7935, 36.0, 1540.1000000000013, 5257.899999999999, 7840.9000000000015, 7.875566056310297, 6.6948848813742865, 9.866146140972633], "isController": false}, {"data": ["Create New Channel", 200, 168, 84.0, 1413.5899999999988, 0, 9527, 2.0, 6838.600000000001, 8030.2, 9081.830000000002, 7.589556769884639, 15.95444902189587, 1.409552643063145], "isController": false}, {"data": ["Delete Channel", 200, 187, 93.5, 3.465000000000001, 0, 32, 1.0, 11.900000000000006, 21.94999999999999, 29.0, 8.976257798123962, 11.92018984785243, 2.6182797282437953], "isController": false}, {"data": ["Logout", 200, 66, 33.0, 59.72500000000001, 0, 681, 7.0, 157.90000000000018, 503.6499999999997, 665.9100000000001, 8.974646623289209, 9.829429128337447, 3.17679703275746], "isController": false}, {"data": ["Post Msg to Main", 200, 0, 0.0, 84.93499999999996, 13, 3300, 33.0, 119.00000000000006, 329.2999999999985, 1102.0300000000027, 8.613635384814161, 6.754637904302511, 7.326637129075326], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 187, 93.5, 586.6000000000001, 0, 7073, 2.0, 2257.6000000000076, 5067.499999999999, 6997.950000000001, 7.608902415826517, 15.648369138767357, 1.3330440365227316], "isController": false}, {"data": ["Delete Msg on Custom", 200, 187, 93.5, 9.075, 0, 789, 1.0, 15.0, 38.499999999999886, 67.84000000000015, 8.667764583513913, 13.910746402877697, 1.9611240600892779], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 2, 0.1662510390689942, 0.058823529411764705], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 37, 3.0756442227763925, 1.088235294117647], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 774, 64.33915211970074, 22.764705882352942], "isController": false}, {"data": ["500/Internal Server Error", 20, 1.6625103906899419, 0.5882352941176471], "isController": false}, {"data": ["403/Forbidden", 34, 2.826267664172901, 1.0], "isController": false}, {"data": ["404/Not Found", 173, 14.380714879467996, 5.088235294117647], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 163, 13.549459684123025, 4.794117647058823], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3400, 1203, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 774, "404/Not Found", 173, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 163, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 37, "403/Forbidden", 34], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Msg on Main", 200, 47, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 21, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "404/Not Found", 4, "500/Internal Server Error", 3], "isController": false}, {"data": ["Delete File on Main", 200, 137, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 110, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, "500/Internal Server Error", 2, "404/Not Found", 1], "isController": false}, {"data": ["Upload Bee File", 200, 90, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 40, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 38, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "500/Internal Server Error", 6, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Post File", 200, 112, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 84, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "500/Internal Server Error", 2, "", ""], "isController": false}, {"data": ["Update Msg to Main", 200, 22, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 12, "403/Forbidden", 7, "500/Internal Server Error", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, {"data": ["Create New Channel", 200, 168, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 121, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 38, "500/Internal Server Error", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "", ""], "isController": false}, {"data": ["Delete Channel", 200, 187, "404/Not Found", 97, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 90, "", "", "", "", "", ""], "isController": false}, {"data": ["Logout", 200, 66, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 66, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 187, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 136, "403/Forbidden", 27, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 18, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "400/Bad Request", 2], "isController": false}, {"data": ["Delete Msg on Custom", 200, 187, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 114, "404/Not Found", 71, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 1, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
