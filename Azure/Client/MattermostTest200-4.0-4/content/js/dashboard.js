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

    var data = {"OkPercent": 74.79411764705883, "KoPercent": 25.205882352941178};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5930882352941177, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.92, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.9975, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.995, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.0475, 500, 1500, "Login"], "isController": false}, {"data": [0.925, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.3475, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.355, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.9875, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.35, 500, 1500, "Post File"], "isController": false}, {"data": [0.8775, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.1525, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.0225, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.6125, 500, 1500, "Logout"], "isController": false}, {"data": [0.8875, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.365, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.24, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3400, 857, 25.205882352941178, 1175.8026470588254, 0, 18007, 47.0, 4453.1, 7268.799999999999, 14808.169999999982, 42.35757266192428, 125.24390642713874, 138.46146190855123], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 200, 0, 0.0, 204.77500000000003, 12, 1418, 30.0, 811.7, 1174.5499999999997, 1405.94, 10.090308258917311, 60.43454149008627, 5.409745345845315], "isController": false}, {"data": ["Get User Data", 200, 0, 0.0, 28.92, 5, 815, 9.0, 73.80000000000001, 112.74999999999994, 332.0900000000008, 10.121457489878543, 37.08184740321356, 5.07061298076923], "isController": false}, {"data": ["Get Channels", 200, 0, 0.0, 43.655, 4, 1002, 10.0, 107.70000000000002, 163.4999999999999, 548.4800000000005, 10.122994381738119, 49.13275397643873, 5.427269448802956], "isController": false}, {"data": ["Login", 200, 0, 0.0, 8691.925, 274, 18007, 7977.5, 16037.9, 16891.0, 17865.370000000003, 9.169685021319518, 13.164542475700335, 4.647391582802256], "isController": false}, {"data": ["Delete Msg on Main", 200, 0, 0.0, 233.66499999999994, 12, 2084, 78.5, 607.0, 1087.2499999999995, 1917.930000000001, 10.138389009986314, 3.564277386323313, 5.564233030871394], "isController": false}, {"data": ["Delete File on Main", 200, 115, 57.5, 985.0299999999997, 0, 7179, 269.5, 3678.7000000000003, 5605.7999999999965, 7050.260000000006, 7.057910152803754, 9.44767441860465, 1.9753188190351838], "isController": false}, {"data": ["Upload Bee File", 200, 9, 4.5, 3722.445, 7, 11146, 2455.5, 9596.0, 10049.7, 10877.690000000006, 7.062396271054769, 5.299728373618419, 332.5801719914192], "isController": false}, {"data": ["Get Bee Movie File", 200, 0, 0.0, 53.165, 5, 1251, 12.0, 75.9, 189.24999999999983, 988.5900000000013, 10.33805437816603, 220.71342267135324, 5.4517083634859915], "isController": false}, {"data": ["Get Stats on TownCentre", 200, 0, 0.0, 13.355000000000006, 3, 119, 7.0, 26.0, 56.59999999999991, 118.62000000000035, 10.514694285263657, 4.89795817780348, 5.6372726197360805], "isController": false}, {"data": ["Post File", 200, 69, 34.5, 2639.0600000000013, 2, 7755, 1696.0, 6891.2, 7226.949999999999, 7740.6900000000005, 7.037050068611237, 10.07926852063615, 4.239135454417508], "isController": false}, {"data": ["Update Msg to Main", 200, 0, 0.0, 347.53499999999974, 19, 1941, 303.0, 850.9000000000001, 1064.4499999999994, 1768.2100000000016, 10.150738466223418, 8.049218393138101, 13.590490661320612], "isController": false}, {"data": ["Create New Channel", 200, 124, 62.0, 757.8, 0, 7397, 13.5, 1975.1000000000004, 2402.849999999999, 7269.340000000009, 7.124029351000926, 13.17559313109995, 2.715062201681271], "isController": false}, {"data": ["Delete Channel", 200, 193, 96.5, 991.4399999999996, 0, 7436, 5.0, 4555.2, 6760.9999999999945, 7306.620000000001, 7.516818882249032, 8.414909903878678, 2.457170281786748], "isController": false}, {"data": ["Logout", 200, 76, 38.0, 303.7199999999998, 0, 5127, 83.5, 504.8, 1917.8999999999992, 4267.490000000002, 7.537499057812618, 8.767789675510667, 2.464408871636391], "isController": false}, {"data": ["Post Msg to Main", 200, 0, 0.0, 305.42499999999995, 24, 2016, 102.0, 771.4000000000001, 1285.6499999999985, 1939.4600000000005, 10.21346134204882, 8.009188923501174, 8.677452507404759], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 127, 63.5, 93.18500000000002, 1, 6335, 7.5, 119.70000000000002, 179.64999999999992, 4342.120000000037, 7.423904974016332, 13.170652665645878, 2.5775595072383073], "isController": false}, {"data": ["Delete Msg on Custom", 200, 144, 72.0, 573.5450000000002, 1, 7401, 7.0, 1498.0, 5743.699999999996, 7264.97, 7.489514679448772, 8.62804524837103, 2.500393492079838], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 2, 0.23337222870478413, 0.058823529411764705], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 22, 2.5670945157526255, 0.6470588235294118], "isController": false}, {"data": ["500/Internal Server Error", 44, 5.134189031505251, 1.2941176470588236], "isController": false}, {"data": ["403/Forbidden", 9, 1.0501750291715286, 0.2647058823529412], "isController": false}, {"data": ["404/Not Found", 162, 18.903150525087515, 4.764705882352941], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 177, 20.653442240373394, 5.205882352941177], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 441, 51.4585764294049, 12.970588235294118], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3400, 857, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 441, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 177, "404/Not Found", 162, "500/Internal Server Error", 44, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 22], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete File on Main", 200, 115, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 62, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 32, "500/Internal Server Error", 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "404/Not Found", 2], "isController": false}, {"data": ["Upload Bee File", 200, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Post File", 200, 69, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 53, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 9, "500/Internal Server Error", 7, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create New Channel", 200, 124, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 98, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9, "", "", "", ""], "isController": false}, {"data": ["Delete Channel", 200, 193, "404/Not Found", 98, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 40, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 36, "500/Internal Server Error", 18, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1], "isController": false}, {"data": ["Logout", 200, 76, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 52, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 127, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 115, "403/Forbidden", 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 3, "", "", "", ""], "isController": false}, {"data": ["Delete Msg on Custom", 200, 144, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 65, "404/Not Found", 62, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 11, "500/Internal Server Error", 4, "400/Bad Request", 2], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
