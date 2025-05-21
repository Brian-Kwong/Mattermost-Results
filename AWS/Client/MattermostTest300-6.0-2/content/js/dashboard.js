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

    var data = {"OkPercent": 54.254901960784316, "KoPercent": 45.745098039215684};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4746078431372549, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.043333333333333335, 500, 1500, "Login"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.195, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.8883333333333333, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [0.99, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "Post File"], "isController": false}, {"data": [0.6416666666666667, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.04, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.24666666666666667, 500, 1500, "Logout"], "isController": false}, {"data": [0.7483333333333333, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 2333, 45.745098039215684, 1281.59, 0, 21623, 10.0, 4843.0, 10551.349999999995, 17776.089999999982, 57.75764439411098, 182.9655095377973, 100.23036036593999], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 300, 0, 0.0, 31.359999999999985, 7, 286, 16.0, 50.0, 136.69999999999993, 273.0, 11.265913102256938, 61.85837104284802, 6.051027545157535], "isController": false}, {"data": ["Get User Data", 300, 0, 0.0, 7.249999999999999, 3, 42, 5.0, 13.0, 19.0, 28.970000000000027, 11.26422107911238, 40.948267011320546, 5.654110971351331], "isController": false}, {"data": ["Get Channels", 300, 0, 0.0, 9.330000000000005, 4, 54, 6.0, 17.0, 27.899999999999977, 43.0, 11.266759304465392, 51.11063400167124, 6.051482048296842], "isController": false}, {"data": ["Login", 300, 0, 0.0, 10567.980000000005, 122, 21623, 10460.0, 19356.7, 20531.55, 21459.28, 10.903540015991858, 15.65396252816748, 5.547282463018827], "isController": false}, {"data": ["Delete Msg on Main", 300, 137, 45.666666666666664, 327.6133333333331, 0, 5122, 12.0, 1212.000000000006, 3041.749999999999, 4557.31, 10.932546190007653, 13.423970974089865, 3.4461720145038446], "isController": false}, {"data": ["Delete File on Main", 300, 237, 79.0, 534.0300000000003, 0, 9855, 4.5, 1973.3000000000047, 4225.699999999999, 7718.050000000006, 7.740936653335054, 13.795825740227066, 1.3300451151464325], "isController": false}, {"data": ["Upload Bee File", 300, 165, 55.0, 998.6066666666666, 0, 11440, 7.0, 3443.3000000000025, 11099.04999999993, 11437.99, 7.727378100610463, 12.171853065515288, 180.37083969232157], "isController": false}, {"data": ["Get Bee Movie File", 300, 28, 9.333333333333334, 209.46000000000006, 3, 4439, 8.0, 741.200000000002, 1584.6499999999994, 3729.300000000007, 10.867202782003913, 212.1778539425306, 5.339468491903934], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 1, 0.3333333333333333, 30.359999999999992, 2, 1301, 5.0, 20.900000000000034, 57.59999999999991, 1007.9100000000001, 10.911471593802284, 5.0750774600822, 5.860653688077399], "isController": false}, {"data": ["Post File", 300, 201, 67.0, 2110.0666666666652, 0, 11440, 52.5, 11409.7, 11428.0, 11437.0, 7.728373435004379, 14.616412046280077, 2.381456009454377], "isController": false}, {"data": ["Update Msg to Main", 300, 103, 34.333333333333336, 317.1466666666666, 0, 5184, 18.0, 971.0000000000024, 2712.749999999999, 4970.68, 10.91901728844404, 13.902269108280255, 10.04578025477707], "isController": false}, {"data": ["Create New Channel", 300, 281, 93.66666666666667, 2333.5533333333337, 0, 11431, 4.0, 8410.6, 11385.9, 11411.98, 7.742934572202865, 16.726024124080528, 0.880960446509227], "isController": false}, {"data": ["Delete Channel", 300, 300, 100.0, 192.1433333333335, 0, 4990, 2.0, 455.7000000000001, 564.95, 4796.420000000004, 8.457136413610352, 13.527041032968738, 1.885787253685902], "isController": false}, {"data": ["Logout", 300, 208, 69.33333333333333, 2432.6000000000013, 0, 11410, 62.5, 8378.0, 11335.0, 11403.99, 8.450704225352112, 15.042226012323944, 1.3658670774647887], "isController": false}, {"data": ["Post Msg to Main", 300, 72, 24.0, 413.2233333333334, 0, 5117, 28.0, 1349.400000000008, 3427.949999999998, 4832.060000000001, 10.866809142608759, 12.100644764009129, 7.178850416108234], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 300, 100.0, 921.7200000000003, 0, 11381, 2.0, 2845.1000000000217, 9541.849999999971, 11379.99, 7.757751286493755, 17.747093469589615, 0.5121327997724393], "isController": false}, {"data": ["Delete Msg on Custom", 300, 300, 100.0, 350.5866666666666, 0, 7129, 1.0, 31.0, 5886.949999999938, 6977.250000000003, 8.457136413610352, 17.544043180729005, 0.8941935151382742], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 145, 6.215173596228032, 2.843137254901961], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 1476, 63.266180882983285, 28.941176470588236], "isController": false}, {"data": ["500/Internal Server Error", 46, 1.9717102443206171, 0.9019607843137255], "isController": false}, {"data": ["403/Forbidden", 19, 0.8144020574367766, 0.37254901960784315], "isController": false}, {"data": ["401/Unauthorized", 24, 1.0287183883411917, 0.47058823529411764], "isController": false}, {"data": ["404/Not Found", 214, 9.172738962708959, 4.196078431372549], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 409, 17.53107586798114, 8.019607843137255], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5100, 2333, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 1476, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 409, "404/Not Found", 214, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 145, "500/Internal Server Error", 46], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Msg on Main", 300, 137, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 94, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 28, "500/Internal Server Error", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "", ""], "isController": false}, {"data": ["Delete File on Main", 300, 237, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 167, "404/Not Found", 27, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 26, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "500/Internal Server Error", 5], "isController": false}, {"data": ["Upload Bee File", 300, 165, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 104, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 41, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, "500/Internal Server Error", 5, "401/Unauthorized", 2], "isController": false}, {"data": ["Get Bee Movie File", 300, 28, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "500/Internal Server Error", 7, "", "", "", ""], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Post File", 300, 201, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 113, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 72, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9, "500/Internal Server Error", 6, "401/Unauthorized", 1], "isController": false}, {"data": ["Update Msg to Main", 300, 103, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 67, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 23, "403/Forbidden", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "", ""], "isController": false}, {"data": ["Create New Channel", 300, 281, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 171, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 88, "500/Internal Server Error", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "401/Unauthorized", 7], "isController": false}, {"data": ["Delete Channel", 300, 300, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 164, "404/Not Found", 127, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9, "", "", "", ""], "isController": false}, {"data": ["Logout", 300, 208, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 121, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 51, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 36, "", "", "", ""], "isController": false}, {"data": ["Post Msg to Main", 300, 72, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 32, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "500/Internal Server Error", 5, "", ""], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 300, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 229, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 35, "401/Unauthorized", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "403/Forbidden", 10], "isController": false}, {"data": ["Delete Msg on Custom", 300, 300, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 225, "404/Not Found", 60, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 15, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
