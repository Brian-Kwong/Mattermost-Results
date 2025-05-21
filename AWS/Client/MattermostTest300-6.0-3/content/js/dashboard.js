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

    var data = {"OkPercent": 39.3921568627451, "KoPercent": 60.6078431372549};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.31392156862745096, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6766666666666666, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.8683333333333333, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.805, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.03166666666666667, 500, 1500, "Login"], "isController": false}, {"data": [0.2733333333333333, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.13166666666666665, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.59, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [0.6566666666666666, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.043333333333333335, 500, 1500, "Post File"], "isController": false}, {"data": [0.3566666666666667, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.011666666666666667, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.0033333333333333335, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.4083333333333333, 500, 1500, "Logout"], "isController": false}, {"data": [0.47333333333333333, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.0033333333333333335, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.0033333333333333335, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 3091, 60.6078431372549, 1473.2143137254834, 0, 36039, 10.0, 4612.400000000003, 7727.29999999999, 25762.82999999995, 51.4392915498356, 142.82411245158656, 51.41782896246445], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 300, 81, 27.0, 557.4699999999998, 0, 6473, 70.0, 2320.800000000002, 3985.999999999998, 6018.430000000004, 7.323682347484316, 29.58007168816981, 2.923989713277836], "isController": false}, {"data": ["Get User Data", 300, 38, 12.666666666666666, 75.80000000000003, 0, 6560, 8.0, 50.400000000000205, 267.7999999999995, 1973.1100000000108, 7.31368390258173, 25.473951476754674, 3.2183542230429802], "isController": false}, {"data": ["Get Channels", 300, 51, 17.0, 171.71666666666667, 0, 5568, 13.0, 296.50000000000017, 1053.1499999999996, 3064.1600000000008, 7.316716257743525, 30.33383851702356, 3.3272957721574556], "isController": false}, {"data": ["Login", 300, 35, 11.666666666666666, 15281.686666666666, 271, 36039, 13331.0, 35505.6, 35767.2, 35997.84, 7.256191950464396, 10.915892042980843, 3.2607748781564436], "isController": false}, {"data": ["Delete Msg on Main", 300, 204, 68.0, 444.1900000000001, 0, 7095, 7.0, 1192.8000000000004, 3803.8499999999976, 5374.77, 6.150313665996966, 8.881937842111197, 1.609111849860593], "isController": false}, {"data": ["Delete File on Main", 300, 300, 100.0, 431.98666666666657, 0, 7344, 2.0, 1366.3000000000054, 4200.899999999999, 7287.93, 6.175507935527698, 12.257800277640545, 0.6494133589102287], "isController": false}, {"data": ["Upload Bee File", 300, 234, 78.0, 1816.8533333333328, 0, 9516, 44.0, 6520.7, 7323.4, 9513.97, 6.167382768332545, 12.156088106202331, 72.98896745163744], "isController": false}, {"data": ["Get Bee Movie File", 300, 115, 38.333333333333336, 403.9233333333333, 0, 8794, 14.0, 1173.8000000000002, 1798.9499999999994, 8792.98, 6.073120369245719, 84.18018963950969, 2.3082008950261144], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 99, 33.0, 172.00000000000006, 0, 6055, 8.0, 189.00000000000068, 1121.1499999999992, 4078.5900000000047, 7.382979770635428, 8.11796117475513, 2.696518002165674], "isController": false}, {"data": ["Post File", 300, 262, 87.33333333333333, 955.7233333333335, 0, 9505, 2.0, 4525.700000000007, 6356.299999999999, 9481.670000000013, 6.165608237252605, 13.458868488860801, 0.8700090685821157], "isController": false}, {"data": ["Update Msg to Main", 300, 182, 60.666666666666664, 718.3833333333333, 0, 7477, 66.5, 3551.600000000014, 5366.149999999999, 7336.56, 6.129078390912619, 10.119822684485259, 3.732453118934766], "isController": false}, {"data": ["Create New Channel", 300, 292, 97.33333333333333, 1487.4166666666658, 0, 9529, 2.0, 6484.5, 9483.0, 9518.9, 6.57606313020605, 13.72926570720079, 0.9829416237395879], "isController": false}, {"data": ["Delete Channel", 300, 299, 99.66666666666667, 162.78000000000014, 0, 3360, 2.0, 113.90000000000003, 2057.9999999999864, 3088.2200000000016, 6.575774845469291, 8.462499931502345, 1.9143167975428521], "isController": false}, {"data": ["Logout", 300, 155, 51.666666666666664, 1086.5733333333326, 0, 6516, 57.5, 3389.8, 6428.85, 6501.93, 6.575198351816947, 9.580676142714681, 1.576913211491255], "isController": false}, {"data": ["Post Msg to Main", 300, 146, 48.666666666666664, 957.5966666666667, 0, 7026, 91.0, 4608.600000000001, 5703.15, 6042.000000000001, 6.073858114674442, 8.847131905217443, 2.8428898531138644], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 299, 99.66666666666667, 290.1366666666666, 0, 9466, 2.0, 385.6000000000025, 2144.9999999999977, 7262.400000000017, 6.575774845469291, 13.7504332476656, 1.0117531700714568], "isController": false}, {"data": ["Delete Msg on Custom", 300, 299, 99.66666666666667, 30.40666666666667, 0, 839, 2.0, 37.7000000000001, 224.79999999999995, 708.3900000000006, 6.575630712579181, 9.568035002904237, 1.6458769425509063], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 10, 0.3235198964736331, 0.19607843137254902], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 157, 5.07926237463604, 3.0784313725490198], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 1893, 61.24231640245875, 37.11764705882353], "isController": false}, {"data": ["500/Internal Server Error", 51, 1.649951472015529, 1.0], "isController": false}, {"data": ["403/Forbidden", 29, 0.938207699773536, 0.5686274509803921], "isController": false}, {"data": ["401/Unauthorized", 118, 3.817534778388871, 2.3137254901960786], "isController": false}, {"data": ["404/Not Found", 428, 13.846651569071497, 8.392156862745098], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 405, 13.102555807182142, 7.9411764705882355], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5100, 3091, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 1893, "404/Not Found", 428, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 405, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 157, "401/Unauthorized", 118], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get Posts on TownCentre", 300, 81, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 46, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 28, "500/Internal Server Error", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", ""], "isController": false}, {"data": ["Get User Data", 300, 38, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 2, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Get Channels", 300, 51, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 37, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 8, "500/Internal Server Error", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, {"data": ["Login", 300, 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Msg on Main", 300, 204, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 132, "404/Not Found", 44, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "500/Internal Server Error", 4], "isController": false}, {"data": ["Delete File on Main", 300, 300, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 194, "404/Not Found", 64, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 26, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, "500/Internal Server Error", 3], "isController": false}, {"data": ["Upload Bee File", 300, 234, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 139, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 59, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 30, "500/Internal Server Error", 5, "401/Unauthorized", 1], "isController": false}, {"data": ["Get Bee Movie File", 300, 115, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 61, "401/Unauthorized", 29, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 12, "500/Internal Server Error", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 99, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 77, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "500/Internal Server Error", 3, "", ""], "isController": false}, {"data": ["Post File", 300, 262, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 209, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 35, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "500/Internal Server Error", 6, "401/Unauthorized", 6], "isController": false}, {"data": ["Update Msg to Main", 300, 182, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 123, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 29, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 11, "400/Bad Request", 10, "403/Forbidden", 4], "isController": false}, {"data": ["Create New Channel", 300, 292, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 191, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 58, "401/Unauthorized", 41, "500/Internal Server Error", 2, "", ""], "isController": false}, {"data": ["Delete Channel", 300, 299, "404/Not Found", 171, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 109, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, "", "", "", ""], "isController": false}, {"data": ["Logout", 300, 155, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 91, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 42, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 22, "", "", "", ""], "isController": false}, {"data": ["Post Msg to Main", 300, 146, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 74, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 53, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "500/Internal Server Error", 7, "401/Unauthorized", 5], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 299, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 223, "401/Unauthorized", 35, "403/Forbidden", 25, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 8], "isController": false}, {"data": ["Delete Msg on Custom", 300, 299, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 152, "404/Not Found", 147, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
