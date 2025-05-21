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

    var data = {"OkPercent": 71.97058823529412, "KoPercent": 28.029411764705884};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5311764705882352, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.82, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.9875, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.9875, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.0275, 500, 1500, "Login"], "isController": false}, {"data": [0.7675, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.295, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.295, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.9675, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [0.975, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.3125, 500, 1500, "Post File"], "isController": false}, {"data": [0.8625, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.0425, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.0325, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.38, 500, 1500, "Logout"], "isController": false}, {"data": [0.695, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.3425, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.24, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3400, 953, 28.029411764705884, 1496.1052941176413, 1, 27229, 79.0, 5010.0, 8362.099999999997, 22013.59999999997, 38.80348318325515, 118.11667267621347, 107.0197859424396], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 200, 0, 0.0, 416.125, 17, 3551, 90.0, 1238.2, 1996.7499999999995, 2949.660000000001, 6.355258976803305, 32.91602121067684, 3.4072628693994282], "isController": false}, {"data": ["Get User Data", 200, 0, 0.0, 55.84000000000001, 8, 1265, 18.0, 92.9, 244.24999999999983, 905.1000000000017, 6.931688212664194, 25.28752967629016, 3.472613333102277], "isController": false}, {"data": ["Get Channels", 200, 0, 0.0, 71.89000000000001, 8, 1440, 23.0, 138.90000000000006, 359.39999999999964, 913.810000000002, 6.930967563071805, 33.61542957920363, 3.7159191329359578], "isController": false}, {"data": ["Login", 200, 0, 0.0, 12275.725000000002, 315, 27229, 11492.5, 24284.4, 25808.6, 27115.850000000002, 6.4441293981183145, 9.251573525502641, 3.266021968439876], "isController": false}, {"data": ["Delete Msg on Main", 200, 16, 8.0, 747.3100000000001, 17, 8838, 202.5, 2004.000000000001, 3263.2499999999977, 8720.400000000001, 5.725409366769724, 2.648700734641589, 2.953729746364365], "isController": false}, {"data": ["Delete File on Main", 200, 113, 56.5, 1054.1299999999997, 1, 8363, 328.5, 3806.5000000000045, 6753.299999999998, 7675.670000000001, 5.75688667568579, 8.016942562462221, 1.5638042946374602], "isController": false}, {"data": ["Upload Bee File", 200, 44, 22.0, 3670.13, 2, 10258, 3521.5, 8207.5, 9621.3, 10250.89, 5.7231156641675724, 5.821844998354605, 222.94788298374635], "isController": false}, {"data": ["Get Bee Movie File", 200, 0, 0.0, 117.83000000000001, 8, 1565, 39.0, 275.40000000000003, 593.8, 1297.810000000001, 6.351222610352493, 135.59612178469357, 3.3492775484280726], "isController": false}, {"data": ["Get Stats on TownCentre", 200, 0, 0.0, 108.0, 5, 1730, 27.0, 277.70000000000005, 445.3499999999994, 1079.8700000000001, 6.341154090044388, 2.95383837983513, 3.3997007767913763], "isController": false}, {"data": ["Post File", 200, 75, 37.5, 1991.8550000000007, 1, 9453, 800.5, 7237.400000000002, 8668.5, 9401.960000000001, 5.72508158241255, 9.037382322737162, 3.1738980112497854], "isController": false}, {"data": ["Update Msg to Main", 200, 0, 0.0, 387.1550000000003, 25, 5624, 147.5, 881.9000000000001, 1096.5499999999997, 4878.0300000000125, 5.768176967669368, 4.573984079831569, 7.7228228737057645], "isController": false}, {"data": ["Create New Channel", 200, 128, 64.0, 1508.3000000000018, 1, 10085, 33.0, 3874.4000000000005, 6799.899999999993, 9048.880000000001, 5.813108559802354, 10.920384255558785, 2.098850094463014], "isController": false}, {"data": ["Delete Channel", 200, 186, 93.0, 1148.5549999999998, 1, 8886, 4.5, 5586.900000000001, 7470.799999999999, 8693.630000000001, 6.273328942003073, 10.735019731579937, 1.143412220444779], "isController": false}, {"data": ["Logout", 200, 121, 60.5, 469.75, 1, 7665, 18.5, 1490.8000000000002, 3559.249999999999, 7271.970000000018, 6.3000063000063, 10.286390657484407, 1.3122962341712343], "isController": false}, {"data": ["Post Msg to Main", 200, 0, 0.0, 698.1049999999993, 45, 3107, 278.0, 1896.8, 2199.2, 2844.63, 6.330115524608324, 4.963948013926254, 5.378125494540275], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 128, 64.0, 65.34500000000011, 1, 840, 7.0, 158.30000000000004, 339.29999999999984, 754.6500000000003, 6.131207847946046, 11.517809242795831, 1.8752874003678726], "isController": false}, {"data": ["Delete Msg on Custom", 200, 142, 71.0, 647.7450000000007, 1, 8916, 5.0, 1259.7000000000003, 6725.249999999993, 8838.95, 6.255082254331644, 10.56901212704072, 1.243503021986614], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 2, 0.2098635886673662, 0.058823529411764705], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 30, 3.147953830010493, 0.8823529411764706], "isController": false}, {"data": ["500/Internal Server Error", 31, 3.2528856243441764, 0.9117647058823529], "isController": false}, {"data": ["404/Not Found", 56, 5.876180482686254, 1.6470588235294117], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 156, 16.369359916054563, 4.588235294117647], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 678, 71.14375655823714, 19.941176470588236], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3400, 953, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 678, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 156, "404/Not Found", 56, "500/Internal Server Error", 31, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 30], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Msg on Main", 200, 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 9, "500/Internal Server Error", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", "", "", ""], "isController": false}, {"data": ["Delete File on Main", 200, 113, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 77, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 21, "500/Internal Server Error", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "400/Bad Request", 2], "isController": false}, {"data": ["Upload Bee File", 200, 44, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 22, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "500/Internal Server Error", 2, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Post File", 200, 75, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 43, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 29, "500/Internal Server Error", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create New Channel", 200, 128, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 103, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 18, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "", "", "", ""], "isController": false}, {"data": ["Delete Channel", 200, 186, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 99, "404/Not Found", 42, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 30, "500/Internal Server Error", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3], "isController": false}, {"data": ["Logout", 200, 121, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 99, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 128, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 128, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Msg on Custom", 200, 142, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 116, "404/Not Found", 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 11, "500/Internal Server Error", 3, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
