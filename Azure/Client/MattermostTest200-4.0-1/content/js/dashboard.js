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

    var data = {"OkPercent": 64.08823529411765, "KoPercent": 35.911764705882355};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5027941176470588, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.845, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.9925, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.995, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.05, 500, 1500, "Login"], "isController": false}, {"data": [0.7125, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.28, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.405, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.995, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.2025, 500, 1500, "Post File"], "isController": false}, {"data": [0.8, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.0025, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.35, 500, 1500, "Logout"], "isController": false}, {"data": [0.9175, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3400, 1221, 35.911764705882355, 1232.6608823529377, 0, 18943, 24.0, 3909.3000000000043, 8794.29999999999, 16557.799999999974, 41.8034500141394, 117.21365117018922, 77.18936924434117], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 200, 0, 0.0, 353.2250000000003, 12, 2524, 67.0, 1041.1000000000001, 2271.5499999999997, 2464.5600000000004, 9.71628449280995, 22.258356763748544, 5.209218932180335], "isController": false}, {"data": ["Get User Data", 200, 0, 0.0, 44.47500000000002, 5, 1337, 10.0, 78.9, 101.5499999999999, 1244.0900000000017, 9.75800156128025, 35.599171789617486, 4.888530079039813], "isController": false}, {"data": ["Get Channels", 200, 0, 0.0, 32.95499999999998, 3, 1543, 6.0, 74.80000000000001, 158.74999999999994, 384.83000000000106, 9.763718023823472, 7.866276728178089, 5.2346496045694195], "isController": false}, {"data": ["Login", 200, 0, 0.0, 8969.240000000003, 192, 18943, 7728.0, 17241.4, 18058.399999999998, 18868.760000000002, 8.780016682031697, 12.60511154736819, 4.449899372777558], "isController": false}, {"data": ["Delete Msg on Main", 200, 26, 13.0, 1022.795, 11, 8149, 114.0, 4164.800000000001, 5618.349999999997, 7806.570000000003, 6.546430558737848, 3.5849059257471114, 3.1980975459068444], "isController": false}, {"data": ["Delete File on Main", 200, 118, 59.0, 500.40500000000014, 1, 5653, 12.0, 1455.0000000000002, 2946.8999999999983, 5447.490000000008, 6.565557087518877, 10.50258313636662, 1.49539539015823], "isController": false}, {"data": ["Upload Bee File", 200, 103, 51.5, 4201.979999999999, 3, 17189, 222.0, 14385.60000000001, 16322.799999999997, 16992.25, 6.537443205962148, 9.42700587144118, 159.56679479374367], "isController": false}, {"data": ["Get Bee Movie File", 200, 0, 0.0, 34.79, 5, 894, 12.0, 80.50000000000003, 135.84999999999997, 588.7300000000012, 9.719589833309033, 207.50944622636922, 5.125564951159061], "isController": false}, {"data": ["Get Stats on TownCentre", 200, 0, 0.0, 12.855000000000006, 3, 131, 8.0, 24.0, 46.74999999999994, 109.88000000000011, 9.790962941205267, 4.560829416948157, 5.249256498751652], "isController": false}, {"data": ["Post File", 200, 111, 55.5, 1030.3799999999992, 1, 12535, 81.0, 2398.1000000000004, 4763.299999999996, 12519.120000000003, 6.541291905151268, 12.323212643090761, 2.5413302330335243], "isController": false}, {"data": ["Update Msg to Main", 200, 3, 1.5, 523.105, 17, 7597, 50.5, 1703.7000000000007, 2792.9499999999994, 4127.9000000000015, 6.567066163191594, 5.229924273518306, 8.748467257018552], "isController": false}, {"data": ["Create New Channel", 200, 170, 85.0, 2878.004999999998, 1, 12613, 6.0, 9725.4, 11312.25, 12530.960000000003, 6.6420909302248345, 13.916056165105775, 1.1657712816744712], "isController": false}, {"data": ["Delete Channel", 200, 200, 100.0, 6.8100000000000005, 1, 231, 2.0, 8.900000000000006, 18.799999999999955, 72.99000000000001, 8.1799591002045, 18.497052338957054, 0.473622827198364], "isController": false}, {"data": ["Logout", 200, 99, 49.5, 359.26, 1, 1354, 16.0, 1212.2, 1280.3999999999999, 1353.8000000000002, 8.27814569536424, 11.914426285699504, 2.204541338990066], "isController": false}, {"data": ["Post Msg to Main", 200, 0, 0.0, 226.95, 20, 2646, 48.0, 624.0000000000001, 1013.2499999999998, 2463.030000000005, 8.681309141418525, 6.807706289608473, 7.375721633822381], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 191, 95.5, 634.3399999999999, 0, 9116, 4.0, 2963.7000000000003, 5100.5, 7541.860000000008, 7.015328492756674, 16.549461354309166, 0.3286379958960328], "isController": false}, {"data": ["Delete Msg on Custom", 200, 200, 100.0, 123.66500000000008, 0, 5394, 2.5, 57.0, 274.74999999999767, 3767.3900000000085, 7.518514341566107, 18.514047874140072, 0.04056620286831322], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 32, 2.6208026208026207, 0.9411764705882353], "isController": false}, {"data": ["500/Internal Server Error", 10, 0.819000819000819, 0.29411764705882354], "isController": false}, {"data": ["403/Forbidden", 4, 0.3276003276003276, 0.11764705882352941], "isController": false}, {"data": ["404/Not Found", 26, 2.1294021294021293, 0.7647058823529411], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 168, 13.75921375921376, 4.9411764705882355], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 981, 80.34398034398035, 28.852941176470587], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3400, 1221, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 981, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 168, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 32, "404/Not Found", 26, "500/Internal Server Error", 10], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Msg on Main", 200, 26, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 18, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "500/Internal Server Error", 2, "404/Not Found", 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 1], "isController": false}, {"data": ["Delete File on Main", 200, 118, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 111, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 3, "500/Internal Server Error", 1, "", ""], "isController": false}, {"data": ["Upload Bee File", 200, 103, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 68, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 22, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 11, "500/Internal Server Error", 2, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Post File", 200, 111, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 101, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": ["Update Msg to Main", 200, 3, "403/Forbidden", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Create New Channel", 200, 170, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 117, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 47, "500/Internal Server Error", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, {"data": ["Delete Channel", 200, 200, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 177, "404/Not Found", 22, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": ["Logout", 200, 99, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 99, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 191, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 165, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "403/Forbidden", 2, "", ""], "isController": false}, {"data": ["Delete Msg on Custom", 200, 200, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 188, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 5, "404/Not Found", 2, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
