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

    var data = {"OkPercent": 44.568627450980394, "KoPercent": 55.431372549019606};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.35343137254901963, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.785, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.9533333333333334, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.9033333333333333, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.028333333333333332, 500, 1500, "Login"], "isController": false}, {"data": [0.33666666666666667, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.0033333333333333335, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.13333333333333333, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.675, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [0.7383333333333333, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.04833333333333333, 500, 1500, "Post File"], "isController": false}, {"data": [0.42, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.021666666666666667, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.006666666666666667, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.40166666666666667, 500, 1500, "Logout"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.013333333333333334, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.006666666666666667, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 2827, 55.431372549019606, 1293.6080392156841, 0, 36089, 17.0, 3940.600000000013, 7371.24999999999, 21422.339999999964, 54.430190612393005, 156.14934000058702, 57.671405072680315], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 300, 58, 19.333333333333332, 588.9033333333335, 0, 7374, 42.5, 1637.400000000001, 4838.299999999997, 6800.860000000001, 7.61131548902702, 32.75231808163136, 3.359756556831156], "isController": false}, {"data": ["Get User Data", 300, 8, 2.6666666666666665, 79.32666666666664, 4, 1892, 10.0, 201.50000000000222, 475.34999999999985, 1695.3300000000024, 7.615952882638166, 27.374020437726895, 3.726387571082227], "isController": false}, {"data": ["Get Channels", 300, 23, 7.666666666666667, 160.91333333333336, 0, 5114, 14.0, 182.90000000000038, 1253.5, 2309.1800000000017, 7.616919717666176, 35.128430390874925, 3.8658842926420554], "isController": false}, {"data": ["Login", 300, 6, 2.0, 13112.813333333335, 298, 36089, 12599.5, 24153.300000000003, 26560.35, 36066.85, 7.167602436984829, 10.339196519233067, 3.572065202783419], "isController": false}, {"data": ["Delete Msg on Main", 300, 191, 63.666666666666664, 414.11666666666645, 0, 7019, 33.0, 810.2000000000016, 3070.899999999997, 6527.300000000001, 7.055171440666008, 9.040862303631062, 2.120203034605616], "isController": false}, {"data": ["Delete File on Main", 300, 295, 98.33333333333333, 340.0, 0, 5171, 5.0, 1207.0000000000018, 3331.0499999999984, 5031.860000000001, 7.152734728911354, 14.730652038827428, 0.6885904195078918], "isController": false}, {"data": ["Upload Bee File", 300, 229, 76.33333333333333, 1839.4800000000005, 1, 8192, 289.0, 5795.400000000008, 6872.4, 8061.290000000002, 7.066305499941114, 13.556656496584619, 87.10983504593099], "isController": false}, {"data": ["Get Bee Movie File", 300, 90, 30.0, 235.9033333333333, 0, 5835, 12.5, 915.100000000004, 1750.6, 3827.4300000000057, 7.215701366172793, 112.65541944270733, 2.7493419430681163], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 67, 22.333333333333332, 200.00333333333333, 0, 5987, 10.0, 216.70000000000078, 1723.8, 3727.6000000000095, 7.622725886777111, 6.686386168881492, 3.2285668401895515], "isController": false}, {"data": ["Post File", 300, 265, 88.33333333333333, 1223.6066666666677, 0, 7733, 10.0, 6176.700000000005, 6813.55, 7689.68, 7.073803348266918, 15.577173536606933, 0.8362377682150437], "isController": false}, {"data": ["Update Msg to Main", 300, 163, 54.333333333333336, 531.4833333333333, 0, 6692, 42.0, 1613.5000000000018, 4370.2999999999965, 6519.550000000005, 7.049866052545002, 10.900006278786952, 4.917924137566386], "isController": false}, {"data": ["Create New Channel", 300, 289, 96.33333333333333, 1127.7300000000002, 0, 7814, 5.0, 4813.200000000003, 7632.4, 7729.91, 7.365397363187744, 16.24815769162309, 0.814892986914144], "isController": false}, {"data": ["Delete Channel", 300, 298, 99.33333333333333, 28.299999999999983, 0, 1349, 3.0, 27.0, 39.94999999999999, 957.0400000000009, 7.547169811320755, 9.318568199685535, 2.31173840408805], "isController": false}, {"data": ["Logout", 300, 122, 40.666666666666664, 986.7500000000005, 0, 6059, 513.0, 2590.4000000000024, 3694.5499999999997, 4833.95, 7.5460307878056145, 8.680858510350639, 2.3344550193681455], "isController": false}, {"data": ["Post Msg to Main", 300, 133, 44.333333333333336, 661.4833333333336, 0, 7171, 85.5, 2918.3000000000197, 4461.649999999998, 6463.58, 7.012294890374457, 9.841500222056005, 3.53397292523725], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 292, 97.33333333333333, 383.0333333333335, 0, 6012, 4.0, 1535.800000000002, 1944.55, 3739.930000000003, 7.543564082576881, 14.485779399469436, 1.7281932063919134], "isController": false}, {"data": ["Delete Msg on Custom", 300, 298, 99.33333333333333, 77.49000000000001, 0, 3582, 3.0, 18.800000000000068, 366.39999999999964, 3314.7800000000093, 7.544322897019992, 10.604587105494781, 2.0497129620897776], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 11, 0.38910505836575876, 0.21568627450980393], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 67, 2.3700035373187123, 1.3137254901960784], "isController": false}, {"data": ["500/Internal Server Error", 40, 1.4149274849663955, 0.7843137254901961], "isController": false}, {"data": ["403/Forbidden", 77, 2.7237354085603114, 1.5098039215686274], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Broken pipe", 2, 0.07074637424831977, 0.0392156862745098], "isController": false}, {"data": ["401/Unauthorized", 48, 1.6979129819596745, 0.9411764705882353], "isController": false}, {"data": ["404/Not Found", 424, 14.998231340643793, 8.313725490196079], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 486, 17.191368942341704, 9.529411764705882], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 1672, 59.143968871595334, 32.78431372549019], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5100, 2827, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 1672, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 486, "404/Not Found", 424, "403/Forbidden", 77, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 67], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get Posts on TownCentre", 300, 58, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 34, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 16, "500/Internal Server Error", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", ""], "isController": false}, {"data": ["Get User Data", 300, 8, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Get Channels", 300, 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 8, "500/Internal Server Error", 7, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, {"data": ["Login", 300, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 5, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Msg on Main", 300, 191, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 105, "404/Not Found", 51, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 23, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "500/Internal Server Error", 6], "isController": false}, {"data": ["Delete File on Main", 300, 295, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 214, "404/Not Found", 47, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 26, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "500/Internal Server Error", 4], "isController": false}, {"data": ["Upload Bee File", 300, 229, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 122, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 82, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, "401/Unauthorized", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Broken pipe", 2], "isController": false}, {"data": ["Get Bee Movie File", 300, 90, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 58, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "401/Unauthorized", 5, "500/Internal Server Error", 3], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 67, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 53, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 10, "500/Internal Server Error", 4, "", "", "", ""], "isController": false}, {"data": ["Post File", 300, 265, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 202, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 55, "500/Internal Server Error", 3, "401/Unauthorized", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2], "isController": false}, {"data": ["Update Msg to Main", 300, 163, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 110, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 26, "400/Bad Request", 11, "403/Forbidden", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7], "isController": false}, {"data": ["Create New Channel", 300, 289, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 211, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 53, "401/Unauthorized", 22, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "500/Internal Server Error", 1], "isController": false}, {"data": ["Delete Channel", 300, 298, "404/Not Found", 174, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 109, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "", ""], "isController": false}, {"data": ["Logout", 300, 122, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 67, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 50, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "", "", "", ""], "isController": false}, {"data": ["Post Msg to Main", 300, 133, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 79, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 39, "500/Internal Server Error", 6, "401/Unauthorized", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 292, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 195, "403/Forbidden", 69, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 19, "401/Unauthorized", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2], "isController": false}, {"data": ["Delete Msg on Custom", 300, 298, "404/Not Found", 151, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 136, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
