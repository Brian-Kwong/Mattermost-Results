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

    var data = {"OkPercent": 53.431372549019606, "KoPercent": 46.568627450980394};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.45431372549019605, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9816666666666667, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.043333333333333335, 500, 1500, "Login"], "isController": false}, {"data": [0.4633333333333333, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.125, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.33666666666666667, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.86, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [0.9416666666666667, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.22166666666666668, 500, 1500, "Post File"], "isController": false}, {"data": [0.575, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.03666666666666667, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.43833333333333335, 500, 1500, "Logout"], "isController": false}, {"data": [0.7, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 2375, 46.568627450980394, 1028.8515686274545, 0, 21887, 10.0, 3331.20000000001, 5415.749999999999, 17675.419999999987, 62.31823847112588, 192.4861034528581, 95.78079607349277], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 300, 0, 0.0, 64.34666666666668, 8, 2542, 16.0, 89.80000000000007, 219.09999999999934, 1065.860000000001, 10.209290454313425, 53.47571172579547, 5.48350561510975], "isController": false}, {"data": ["Get User Data", 300, 0, 0.0, 7.063333333333331, 3, 46, 5.0, 13.0, 19.94999999999999, 25.99000000000001, 11.167361524717093, 40.613134678379986, 5.60549201533651], "isController": false}, {"data": ["Get Channels", 300, 0, 0.0, 11.243333333333336, 3, 218, 7.0, 24.800000000000068, 32.94999999999999, 50.99000000000001, 11.169856281182515, 50.68296835440092, 5.999434526025765], "isController": false}, {"data": ["Login", 300, 0, 0.0, 10526.053333333333, 123, 21887, 10356.0, 19338.400000000005, 20623.55, 21708.02, 10.804192026506284, 15.511330896387799, 5.496738203172831], "isController": false}, {"data": ["Delete Msg on Main", 300, 144, 48.0, 396.09999999999974, 0, 4755, 28.0, 1535.8000000000002, 2856.95, 4438.340000000004, 9.958175662218682, 11.952695813002057, 3.2046718884850294], "isController": false}, {"data": ["Delete File on Main", 300, 254, 84.66666666666667, 381.78999999999974, 0, 5655, 2.0, 1022.7000000000005, 3178.699999999998, 5140.970000000001, 9.362711441233381, 17.32839173974783, 1.416780612165283], "isController": false}, {"data": ["Upload Bee File", 300, 187, 62.333333333333336, 1066.1633333333339, 0, 7180, 8.0, 4746.8, 5686.799999999999, 6611.77, 9.35103796521414, 15.55809381039212, 185.98505270673587], "isController": false}, {"data": ["Get Bee Movie File", 300, 36, 12.0, 204.7833333333333, 0, 4416, 9.0, 575.9000000000003, 1198.2499999999998, 3828.1100000000024, 9.933774834437086, 188.94165847475165, 4.740887572433775], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 12, 4.0, 133.51666666666668, 2, 3577, 6.0, 97.20000000000027, 766.3499999999999, 3423.020000000002, 9.934761731297812, 5.068604186674173, 5.193758899890717], "isController": false}, {"data": ["Post File", 300, 214, 71.33333333333333, 1060.1966666666663, 0, 6449, 44.0, 5026.6, 5082.95, 5711.6, 9.351912466099318, 18.15957528679198, 2.6029489697309764], "isController": false}, {"data": ["Update Msg to Main", 300, 113, 37.666666666666664, 423.7500000000001, 0, 5178, 40.0, 1318.8000000000002, 3161.3999999999937, 4943.35, 9.959828690946516, 13.11698415349756, 8.851927434348129], "isController": false}, {"data": ["Create New Channel", 300, 289, 96.33333333333333, 1197.2399999999993, 0, 5955, 2.0, 5003.8, 5076.95, 5897.150000000001, 9.367388996440393, 20.80447697769, 0.6582786251795415], "isController": false}, {"data": ["Delete Channel", 300, 300, 100.0, 35.86999999999998, 0, 647, 1.0, 19.0, 442.0, 494.0, 10.109860483925322, 15.92678196822134, 2.2641875042124417], "isController": false}, {"data": ["Logout", 300, 146, 48.666666666666664, 806.8066666666665, 0, 5076, 56.0, 3287.7000000000094, 5009.95, 5054.8, 10.109179134654266, 13.207221323628522, 2.731123740564766], "isController": false}, {"data": ["Post Msg to Main", 300, 80, 26.666666666666668, 499.7166666666666, 0, 5473, 36.0, 2205.9000000000055, 3580.099999999999, 5206.52, 9.937065253395165, 11.483197561278569, 6.282897120321298], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 300, 100.0, 643.0033333333334, 0, 5031, 2.0, 2723.6000000000004, 4987.149999999999, 5027.99, 9.634530156079387, 20.0014978683602, 1.4840689029481662], "isController": false}, {"data": ["Delete Msg on Custom", 300, 300, 100.0, 32.83333333333332, 0, 910, 2.0, 25.0, 242.79999999999995, 617.9700000000009, 10.109519797809604, 18.426574347093513, 1.6501026748104464], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 71, 2.9894736842105263, 1.392156862745098], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 1413, 59.49473684210526, 27.705882352941178], "isController": false}, {"data": ["500/Internal Server Error", 52, 2.1894736842105265, 1.0196078431372548], "isController": false}, {"data": ["403/Forbidden", 58, 2.442105263157895, 1.1372549019607843], "isController": false}, {"data": ["401/Unauthorized", 17, 0.7157894736842105, 0.3333333333333333], "isController": false}, {"data": ["404/Not Found", 261, 10.989473684210527, 5.117647058823529], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 503, 21.178947368421053, 9.862745098039216], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5100, 2375, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 1413, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 503, "404/Not Found", 261, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 71, "403/Forbidden", 58], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Msg on Main", 300, 144, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 92, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 28, "500/Internal Server Error", 10, "404/Not Found", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4], "isController": false}, {"data": ["Delete File on Main", 300, 254, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 173, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 33, "404/Not Found", 31, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, "500/Internal Server Error", 7], "isController": false}, {"data": ["Upload Bee File", 300, 187, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 99, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 65, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 15, "500/Internal Server Error", 4, "401/Unauthorized", 3], "isController": false}, {"data": ["Get Bee Movie File", 300, 36, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 14, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "500/Internal Server Error", 7, "", ""], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 7, "500/Internal Server Error", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": ["Post File", 300, 214, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 135, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 64, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "401/Unauthorized", 5, "500/Internal Server Error", 4], "isController": false}, {"data": ["Update Msg to Main", 300, 113, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 77, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 19, "403/Forbidden", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "500/Internal Server Error", 3], "isController": false}, {"data": ["Create New Channel", 300, 289, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 181, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 96, "500/Internal Server Error", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", ""], "isController": false}, {"data": ["Delete Channel", 300, 300, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 162, "404/Not Found", 128, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 10, "", "", "", ""], "isController": false}, {"data": ["Logout", 300, 146, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 74, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 72, "", "", "", "", "", ""], "isController": false}, {"data": ["Post Msg to Main", 300, 80, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 42, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 29, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "500/Internal Server Error", 3, "", ""], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 300, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 207, "403/Forbidden", 47, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 34, "401/Unauthorized", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3], "isController": false}, {"data": ["Delete Msg on Custom", 300, 300, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 178, "404/Not Found", 92, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
