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

    var data = {"OkPercent": 42.509803921568626, "KoPercent": 57.490196078431374};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.32029411764705884, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6583333333333333, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.785, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.77, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.021666666666666667, 500, 1500, "Login"], "isController": false}, {"data": [0.385, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.12833333333333333, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.13, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.6466666666666666, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [0.6916666666666667, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.06833333333333333, 500, 1500, "Post File"], "isController": false}, {"data": [0.4483333333333333, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.006666666666666667, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.19666666666666666, 500, 1500, "Logout"], "isController": false}, {"data": [0.5083333333333333, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 2932, 57.490196078431374, 1770.3647058823556, 0, 45847, 16.0, 4217.0000000000055, 9450.849999999984, 45201.96, 47.77875625339604, 141.67123985286952, 51.37611491083641], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 300, 76, 25.333333333333332, 430.6666666666665, 0, 8743, 63.5, 1011.200000000001, 2315.299999999996, 7333.2200000000175, 6.097560975609756, 28.651331459603657, 2.4409298780487805], "isController": false}, {"data": ["Get User Data", 300, 59, 19.666666666666668, 90.87333333333339, 0, 4962, 19.0, 142.90000000000003, 503.9499999999991, 2024.3000000000088, 6.088774329727426, 20.644909023563557, 2.470769919171521], "isController": false}, {"data": ["Get Channels", 300, 65, 21.666666666666668, 111.90666666666671, 1, 4990, 24.0, 170.80000000000007, 506.04999999999933, 1957.720000000002, 6.094216588457554, 26.29075189936417, 2.5920655204460967], "isController": false}, {"data": ["Login", 300, 54, 18.0, 20678.466666666664, 297, 45847, 17236.5, 45387.6, 45597.2, 45807.93, 5.871760745322163, 9.022136232188993, 2.450064803442809], "isController": false}, {"data": ["Delete Msg on Main", 300, 164, 54.666666666666664, 590.1866666666667, 0, 7508, 124.0, 1548.6000000000026, 4201.799999999998, 6788.830000000003, 5.368551028077522, 6.2090298469068195, 1.7209596340885096], "isController": false}, {"data": ["Delete File on Main", 300, 250, 83.33333333333333, 150.9, 0, 6091, 3.0, 429.7000000000001, 668.5999999999995, 3617.2800000000025, 5.407061622478958, 11.067649662959827, 0.6095265103725466], "isController": false}, {"data": ["Upload Bee File", 300, 225, 75.0, 2487.090000000001, 0, 14311, 75.5, 10115.300000000005, 12319.149999999996, 13730.98, 5.373840146168452, 10.047261804535522, 71.54463478038906], "isController": false}, {"data": ["Get Bee Movie File", 300, 96, 32.0, 175.9466666666667, 0, 6183, 19.0, 405.4000000000019, 1060.0499999999995, 4920.330000000028, 6.109606337698308, 93.31735554599516, 2.244564359611429], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 85, 28.333333333333332, 170.69000000000003, 0, 6545, 19.0, 248.4000000000002, 1109.249999999998, 2870.7100000000028, 6.106248727864848, 6.228512842204355, 2.368019953439853], "isController": false}, {"data": ["Post File", 300, 245, 81.66666666666667, 856.6233333333333, 0, 9290, 5.0, 2627.5000000000045, 7161.999999999996, 8302.550000000003, 5.381165919282512, 11.701495936098654, 0.906460201793722], "isController": false}, {"data": ["Update Msg to Main", 300, 140, 46.666666666666664, 849.5733333333337, 0, 7023, 154.0, 3196.000000000004, 4314.25, 7016.99, 5.363559973539771, 6.66101071818068, 4.822297855246456], "isController": false}, {"data": ["Create New Channel", 300, 285, 95.0, 1255.3600000000006, 0, 9641, 2.0, 6525.000000000001, 7740.7, 9454.0, 5.446029844243546, 12.65111669140072, 0.3095124838888284], "isController": false}, {"data": ["Delete Channel", 300, 300, 100.0, 33.523333333333355, 0, 683, 3.0, 55.80000000000007, 295.29999999999984, 639.8900000000001, 6.047777441790142, 12.239366778802541, 0.6237754825622418], "isController": false}, {"data": ["Logout", 300, 167, 55.666666666666664, 1215.8099999999997, 0, 7143, 11.0, 4766.000000000001, 5894.5999999999985, 7132.98, 6.047046018020197, 9.197592425318982, 1.2739346490697627], "isController": false}, {"data": ["Post Msg to Main", 300, 124, 41.333333333333336, 640.1633333333332, 1, 7509, 109.5, 1660.3000000000009, 4805.799999999999, 6761.300000000003, 6.110104075439419, 8.804675884437566, 3.062809005784232], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 297, 99.0, 323.25333333333333, 0, 6959, 3.0, 1207.5000000000002, 2219.299999999999, 5644.380000000005, 5.554012774229381, 12.448274640146256, 0.5507367745070814], "isController": false}, {"data": ["Delete Msg on Custom", 300, 300, 100.0, 35.16666666666664, 0, 1665, 2.0, 104.80000000000007, 255.44999999999987, 330.99, 5.897965202005308, 12.586223182689471, 0.5348102821193355], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 65, 2.2169167803547065, 1.2745098039215685], "isController": false}, {"data": ["500/Internal Server Error", 29, 0.9890859481582538, 0.5686274509803921], "isController": false}, {"data": ["403/Forbidden", 34, 1.159618008185539, 0.6666666666666666], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Broken pipe", 4, 0.1364256480218281, 0.0784313725490196], "isController": false}, {"data": ["401/Unauthorized", 51, 1.7394270122783084, 1.0], "isController": false}, {"data": ["404/Not Found", 170, 5.798090040927694, 3.3333333333333335], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 381, 12.994542974079128, 7.470588235294118], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 2198, 74.96589358799454, 43.09803921568628], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5100, 2932, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 2198, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 381, "404/Not Found", 170, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 65, "401/Unauthorized", 51], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get Posts on TownCentre", 300, 76, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 62, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", "", "", ""], "isController": false}, {"data": ["Get User Data", 300, 59, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 53, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 4, "500/Internal Server Error", 2, "", "", "", ""], "isController": false}, {"data": ["Get Channels", 300, 65, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 57, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 4, "500/Internal Server Error", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, {"data": ["Login", 300, 54, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 53, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Msg on Main", 300, 164, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 85, "404/Not Found", 44, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 22, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9, "500/Internal Server Error", 4], "isController": false}, {"data": ["Delete File on Main", 300, 250, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 234, "404/Not Found", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 4, "500/Internal Server Error", 2, "", ""], "isController": false}, {"data": ["Upload Bee File", 300, 225, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 111, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 90, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "500/Internal Server Error", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Broken pipe", 4], "isController": false}, {"data": ["Get Bee Movie File", 300, 96, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 83, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 6, "500/Internal Server Error", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", ""], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 85, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 76, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "500/Internal Server Error", 2, "", ""], "isController": false}, {"data": ["Post File", 300, 245, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 206, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 34, "500/Internal Server Error", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", ""], "isController": false}, {"data": ["Update Msg to Main", 300, 140, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 70, "401/Unauthorized", 49, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "403/Forbidden", 1], "isController": false}, {"data": ["Create New Channel", 300, 285, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 231, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 50, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "500/Internal Server Error", 2, "", ""], "isController": false}, {"data": ["Delete Channel", 300, 300, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 207, "404/Not Found", 65, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 9, "", ""], "isController": false}, {"data": ["Logout", 300, 167, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 137, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 30, "", "", "", "", "", ""], "isController": false}, {"data": ["Post Msg to Main", 300, 124, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 91, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 28, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "500/Internal Server Error", 1, "", ""], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 297, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 250, "403/Forbidden", 33, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", ""], "isController": false}, {"data": ["Delete Msg on Custom", 300, 300, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 245, "404/Not Found", 51, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 2, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
