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

    var data = {"OkPercent": 80.8529411764706, "KoPercent": 19.147058823529413};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6889705882352941, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.0575, 500, 1500, "Login"], "isController": false}, {"data": [0.9375, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.6075, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.81, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.7475, 500, 1500, "Post File"], "isController": false}, {"data": [0.99, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.3825, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.0775, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.42, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.45, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.2325, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3400, 651, 19.147058823529413, 711.6902941176484, 0, 13940, 20.0, 2103.9, 4050.3499999999976, 11631.269999999984, 47.18224837290629, 133.60158570082984, 161.5097446737833], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 200, 0, 0.0, 27.21000000000001, 7, 255, 13.5, 29.80000000000001, 200.79999999999927, 250.9000000000001, 11.818235537434262, 66.12372030668323, 6.347685103114106], "isController": false}, {"data": ["Get User Data", 200, 0, 0.0, 7.309999999999995, 3, 54, 5.0, 13.900000000000006, 22.899999999999977, 26.99000000000001, 11.812651349595416, 43.145420659588915, 5.929397259464887], "isController": false}, {"data": ["Get Channels", 200, 0, 0.0, 6.649999999999998, 2, 77, 4.0, 13.900000000000006, 18.0, 53.950000000000045, 11.822427144292723, 40.28590184799314, 6.349936454454099], "isController": false}, {"data": ["Login", 200, 0, 0.0, 7009.01, 169, 13940, 6905.0, 12567.7, 13267.949999999999, 13875.0, 11.2139052425007, 16.09934600154191, 5.705348069105691], "isController": false}, {"data": ["Delete Msg on Main", 200, 0, 0.0, 163.25499999999994, 13, 1118, 36.0, 620.0000000000002, 772.4499999999998, 1106.0400000000009, 11.382391440441637, 4.001621990780262, 6.258092168914688], "isController": false}, {"data": ["Delete File on Main", 200, 46, 23.0, 928.525, 0, 5432, 277.0, 3282.2000000000007, 3952.9499999999994, 4619.7300000000005, 8.826514850611236, 6.337204932366831, 3.83362950428086], "isController": false}, {"data": ["Upload Bee File", 200, 0, 0.0, 506.0499999999999, 4, 3276, 17.0, 2565.7000000000003, 2958.899999999999, 3221.4000000000005, 11.38498320714977, 7.860530397905163, 561.4150911510218], "isController": false}, {"data": ["Get Bee Movie File", 200, 0, 0.0, 7.6099999999999985, 3, 35, 6.0, 13.900000000000006, 18.94999999999999, 33.930000000000064, 11.968880909634949, 255.53093207660083, 6.32340290245362], "isController": false}, {"data": ["Get Stats on TownCentre", 200, 0, 0.0, 4.744999999999998, 2, 29, 3.0, 8.0, 12.0, 28.0, 11.975330818513862, 5.566657685168552, 6.432062451350219], "isController": false}, {"data": ["Post File", 200, 2, 1.0, 643.9550000000004, 30, 5637, 228.0, 1726.0, 2488.5499999999993, 5515.540000000008, 8.823399655887412, 10.330917123461418, 7.673298807186659], "isController": false}, {"data": ["Update Msg to Main", 200, 0, 0.0, 67.41999999999997, 16, 866, 29.5, 140.40000000000003, 221.69999999999993, 746.880000000001, 11.41031492469192, 8.880879877909631, 15.288039137380192], "isController": false}, {"data": ["Create New Channel", 200, 84, 42.0, 861.2599999999993, 0, 5843, 282.0, 2304.9000000000005, 4034.199999999999, 5713.9400000000005, 8.83665444262802, 12.950574451575134, 5.278347711306499], "isController": false}, {"data": ["Delete Channel", 200, 175, 87.5, 521.2499999999997, 0, 5260, 2.0, 2324.500000000001, 3222.549999999998, 4065.010000000001, 8.96700143472023, 13.372084673713236, 2.0922711453102583], "isController": false}, {"data": ["Logout", 200, 115, 57.5, 313.7150000000002, 0, 3674, 7.5, 1120.000000000001, 2952.6999999999994, 3443.800000000001, 9.05018326621114, 13.975816213403322, 2.0320931518394496], "isController": false}, {"data": ["Post Msg to Main", 200, 0, 0.0, 33.84500000000002, 14, 176, 23.0, 70.60000000000002, 102.0, 114.95000000000005, 11.953858107704262, 9.373972715318867, 10.167783605283605], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 100, 50.0, 334.2099999999998, 0, 4609, 31.5, 1252.0, 2719.999999999998, 3497.3700000000026, 8.873114463176575, 14.201272390749779, 3.7736731921029283], "isController": false}, {"data": ["Delete Msg on Custom", 200, 129, 64.5, 662.7149999999999, 0, 5205, 12.5, 2599.6000000000004, 3520.7999999999993, 4365.95, 8.946544397226571, 14.64747644542608, 1.841162142138224], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 24, 3.686635944700461, 0.7058823529411765], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 379, 58.21812596006144, 11.147058823529411], "isController": false}, {"data": ["500/Internal Server Error", 14, 2.150537634408602, 0.4117647058823529], "isController": false}, {"data": ["404/Not Found", 60, 9.216589861751151, 1.7647058823529411], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 174, 26.72811059907834, 5.117647058823529], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3400, 651, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 379, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 174, "404/Not Found", 60, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 24, "500/Internal Server Error", 14], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete File on Main", 200, 46, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 37, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "500/Internal Server Error", 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 1, "404/Not Found", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Post File", 200, 2, "500/Internal Server Error", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create New Channel", 200, 84, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 42, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 32, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "500/Internal Server Error", 3, "", ""], "isController": false}, {"data": ["Delete Channel", 200, 175, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 72, "404/Not Found", 56, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 36, "500/Internal Server Error", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5], "isController": false}, {"data": ["Logout", 200, 115, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 86, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 27, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 100, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 81, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", ""], "isController": false}, {"data": ["Delete Msg on Custom", 200, 129, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 97, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 24, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "404/Not Found", 3, "500/Internal Server Error", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
