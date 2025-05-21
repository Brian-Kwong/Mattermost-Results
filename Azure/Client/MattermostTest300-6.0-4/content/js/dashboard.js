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

    var data = {"OkPercent": 64.3921568627451, "KoPercent": 35.6078431372549};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4988235294117647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8483333333333334, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.995, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.9883333333333333, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "Login"], "isController": false}, {"data": [0.7266666666666667, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.17333333333333334, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.065, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.9766666666666667, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [0.9816666666666667, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.155, 500, 1500, "Post File"], "isController": false}, {"data": [0.7783333333333333, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.05333333333333334, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.056666666666666664, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.4866666666666667, 500, 1500, "Logout"], "isController": false}, {"data": [0.815, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.20333333333333334, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.14333333333333334, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 1816, 35.6078431372549, 1686.9319607843138, 1, 33655, 48.0, 6308.20000000001, 11618.249999999996, 22614.649999999972, 52.725167479943764, 164.1648831808008, 96.0254689696882], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 300, 0, 0.0, 356.2366666666666, 14, 2672, 109.0, 1058.500000000001, 1489.6, 2154.010000000001, 8.063215610385422, 41.40196116721765, 4.32295446298984], "isController": false}, {"data": ["Get User Data", 300, 0, 0.0, 49.13666666666666, 5, 909, 12.0, 104.7000000000001, 228.5499999999999, 812.5100000000032, 8.089305937550558, 29.359862043628326, 4.052552681604919], "isController": false}, {"data": ["Get Channels", 300, 0, 0.0, 74.04666666666668, 6, 1911, 18.0, 186.70000000000044, 322.0499999999998, 855.6700000000003, 8.06842020332419, 39.131181376405245, 4.325744816040019], "isController": false}, {"data": ["Login", 300, 0, 0.0, 13740.89666666666, 253, 33655, 13706.0, 24819.9, 28293.749999999996, 32556.350000000002, 7.603599036877455, 10.916312888100368, 3.853554484539349], "isController": false}, {"data": ["Delete Msg on Main", 300, 57, 19.0, 626.0033333333332, 1, 9370, 163.0, 1306.7000000000075, 2624.749999999999, 8357.220000000001, 6.823920114641858, 4.616053200987194, 3.1588841397880034], "isController": false}, {"data": ["Delete File on Main", 300, 232, 77.33333333333333, 698.4900000000004, 1, 9694, 8.5, 2126.1000000000167, 5565.049999999998, 8369.870000000003, 6.892907198492751, 13.21506283315718, 0.9698087074650185], "isController": false}, {"data": ["Upload Bee File", 300, 165, 55.0, 7411.036666666664, 1, 17998, 8649.0, 14619.700000000004, 16743.3, 17961.220000000005, 6.826093881544518, 10.075887854388041, 161.570709088944], "isController": false}, {"data": ["Get Bee Movie File", 300, 3, 1.0, 123.80999999999999, 5, 8178, 27.0, 142.4000000000002, 255.74999999999972, 2479.9500000000044, 6.815548538064839, 144.15799222459503, 3.5701760115409953], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 0, 0.0, 96.51333333333334, 3, 1934, 23.5, 219.30000000000024, 312.0, 1830.5100000000032, 7.733353955610548, 3.602353356275617, 4.146104806279483], "isController": false}, {"data": ["Post File", 300, 201, 67.0, 1543.4866666666685, 1, 10596, 66.5, 7692.900000000013, 9650.15, 10164.8, 6.832779119027012, 13.64485082477338, 1.9884454858105953], "isController": false}, {"data": ["Update Msg to Main", 300, 38, 12.666666666666666, 666.7166666666666, 1, 9737, 154.5, 1113.500000000001, 3433.0499999999993, 9618.470000000008, 6.820196876349831, 6.423861737558824, 8.187566425875827], "isController": false}, {"data": ["Create New Channel", 300, 231, 77.0, 802.1066666666663, 1, 10153, 4.5, 2783.100000000001, 3534.0, 9631.020000000004, 6.6904549509366635, 14.080685318632916, 1.5656797084076717], "isController": false}, {"data": ["Delete Channel", 300, 282, 94.0, 557.366666666666, 1, 10156, 4.0, 1387.2000000000012, 5866.099999999996, 9459.600000000006, 7.168972686214065, 9.167557187492532, 2.1433408084808945], "isController": false}, {"data": ["Logout", 300, 100, 33.333333333333336, 606.6766666666665, 1, 6292, 148.5, 1360.9, 1469.0999999999995, 4779.580000000002, 7.3168947098851245, 7.998971252225556, 2.5723457964439893], "isController": false}, {"data": ["Post Msg to Main", 300, 19, 6.333333333333333, 645.0266666666671, 6, 9670, 195.5, 1409.2000000000003, 3021.999999999988, 7700.430000000001, 6.8147744309663345, 5.831778712916269, 5.481101778656127], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 238, 79.33333333333333, 281.10333333333324, 1, 10173, 4.0, 121.60000000000014, 676.1999999999989, 9174.700000000004, 7.123691021774749, 14.469556795110774, 1.5443939519863226], "isController": false}, {"data": ["Delete Msg on Custom", 300, 250, 83.33333333333333, 399.19000000000017, 1, 9916, 3.0, 135.90000000000003, 1552.249999999998, 9843.86, 7.168116219057632, 13.56288323288015, 1.0811675293295422], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 64, 3.5242290748898677, 1.2549019607843137], "isController": false}, {"data": ["500/Internal Server Error", 42, 2.3127753303964758, 0.8235294117647058], "isController": false}, {"data": ["403/Forbidden", 21, 1.1563876651982379, 0.4117647058823529], "isController": false}, {"data": ["404/Not Found", 177, 9.746696035242291, 3.4705882352941178], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 236, 12.995594713656388, 4.627450980392157], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 1276, 70.26431718061674, 25.019607843137255], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5100, 1816, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 1276, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 236, "404/Not Found", 177, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 64, "500/Internal Server Error", 42], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Msg on Main", 300, 57, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 31, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 10, "500/Internal Server Error", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "404/Not Found", 3], "isController": false}, {"data": ["Delete File on Main", 300, 232, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 198, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 20, "500/Internal Server Error", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "404/Not Found", 2], "isController": false}, {"data": ["Upload Bee File", 300, 165, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 95, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 47, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "500/Internal Server Error", 9, "", ""], "isController": false}, {"data": ["Get Bee Movie File", 300, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 2, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Post File", 300, 201, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 156, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 35, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9, "500/Internal Server Error", 1, "", ""], "isController": false}, {"data": ["Update Msg to Main", 300, 38, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 13, "403/Forbidden", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "404/Not Found", 1], "isController": false}, {"data": ["Create New Channel", 300, 231, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 209, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, "500/Internal Server Error", 1, "", ""], "isController": false}, {"data": ["Delete Channel", 300, 282, "404/Not Found", 140, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 108, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 17, "500/Internal Server Error", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6], "isController": false}, {"data": ["Logout", 300, 100, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 87, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 6, "", "", "", ""], "isController": false}, {"data": ["Post Msg to Main", 300, 19, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "500/Internal Server Error", 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 2, "", ""], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 238, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 215, "403/Forbidden", 15, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, {"data": ["Delete Msg on Custom", 300, 250, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 207, "404/Not Found", 31, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 9, "500/Internal Server Error", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
