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

    var data = {"OkPercent": 70.50980392156863, "KoPercent": 29.49019607843137};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.46147058823529413, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6933333333333334, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.98, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.95, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.03, 500, 1500, "Login"], "isController": false}, {"data": [0.49833333333333335, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.19333333333333333, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.02666666666666667, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.9083333333333333, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [0.9016666666666666, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "Post File"], "isController": false}, {"data": [0.455, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.15666666666666668, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.19833333333333333, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.4633333333333333, 500, 1500, "Logout"], "isController": false}, {"data": [0.6183333333333333, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.3616666666666667, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.20166666666666666, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 1504, 29.49019607843137, 2554.0315686274475, 0, 62925, 174.5, 5033.600000000008, 17144.999999999996, 46031.719999999885, 40.99217129904994, 124.11886140978909, 84.06436719089089], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 300, 11, 3.6666666666666665, 846.396666666667, 26, 8380, 430.5, 1767.6000000000004, 3448.7999999999965, 7234.550000000007, 4.209994527007115, 24.74228310195905, 2.1894027201827138], "isController": false}, {"data": ["Get User Data", 300, 0, 0.0, 104.50999999999996, 7, 1762, 33.0, 264.8000000000004, 445.1499999999998, 1216.3900000000006, 4.570662441343166, 16.720575289284845, 2.289794758211957], "isController": false}, {"data": ["Get Channels", 300, 0, 0.0, 186.02666666666659, 7, 1991, 70.5, 472.80000000000007, 823.4999999999994, 1773.600000000004, 4.469007433449031, 21.67631537785458, 2.3959815243784353], "isController": false}, {"data": ["Login", 300, 0, 0.0, 21775.626666666656, 297, 62925, 15565.5, 50850.70000000001, 58770.75, 61664.89, 4.423734811843813, 6.351054692108057, 2.2419781790064293], "isController": false}, {"data": ["Delete Msg on Main", 300, 58, 19.333333333333332, 764.5633333333336, 0, 7138, 550.5, 1585.3000000000006, 1943.75, 6615.760000000001, 4.329629095107519, 3.246672161386924, 1.9248386536657525], "isController": false}, {"data": ["Delete File on Main", 300, 170, 56.666666666666664, 1074.5566666666657, 0, 9685, 190.0, 3477.9000000000024, 5361.4, 7355.6500000000015, 4.271557124957285, 6.198193465051544, 1.0914996458167217], "isController": false}, {"data": ["Upload Bee File", 300, 136, 45.333333333333336, 12700.753333333334, 1, 30272, 13999.0, 25374.9, 26905.649999999998, 30098.04, 4.3860931606187314, 6.0489535969618995, 118.95561525008041], "isController": false}, {"data": ["Get Bee Movie File", 300, 20, 6.666666666666667, 130.28333333333327, 1, 2992, 38.5, 194.30000000000024, 749.4499999999996, 1812.1300000000008, 4.27356515050072, 85.81201966908361, 2.1109074737531874], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 17, 5.666666666666667, 158.21000000000012, 0, 1726, 51.5, 343.80000000000007, 831.2999999999989, 1594.1700000000017, 4.269368702681163, 2.398531893073661, 2.174501217659532], "isController": false}, {"data": ["Post File", 300, 136, 45.333333333333336, 1138.0899999999988, 1, 12838, 422.5, 3138.800000000001, 4351.499999999998, 8744.980000000005, 4.245503304416738, 7.420827444171632, 2.022998908551859], "isController": false}, {"data": ["Update Msg to Main", 300, 50, 16.666666666666668, 1122.6233333333332, 0, 9323, 774.5, 2170.4, 3291.099999999998, 6951.7500000000055, 4.320400933206602, 4.486888258230364, 4.858932158904346], "isController": false}, {"data": ["Create New Channel", 300, 182, 60.666666666666664, 854.8000000000008, 0, 9395, 6.5, 2482.000000000001, 3845.749999999999, 8585.020000000004, 4.27453941837767, 7.745821637718535, 1.7434054097858454], "isController": false}, {"data": ["Delete Channel", 300, 214, 71.33333333333333, 449.4633333333334, 1, 8642, 3.0, 1534.4000000000005, 2684.75, 7236.090000000004, 4.562390692722987, 7.07335409379515, 1.076171726484678], "isController": false}, {"data": ["Logout", 300, 101, 33.666666666666664, 489.34000000000015, 1, 5264, 32.5, 1715.8000000000015, 1944.6, 3496.880000000002, 4.588839941262849, 5.029948155668746, 1.605197721640969], "isController": false}, {"data": ["Post Msg to Main", 300, 30, 10.0, 837.7966666666664, 0, 7209, 472.0, 1847.6000000000001, 2555.5999999999967, 6676.290000000007, 4.274295809765341, 4.023653997535156, 3.2683336123498656], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 184, 61.333333333333336, 221.88666666666666, 0, 5938, 4.0, 392.80000000000007, 1645.3999999999978, 3082.460000000006, 4.515624059244987, 7.8254059828255755, 1.6576985275302545], "isController": false}, {"data": ["Delete Msg on Custom", 300, 195, 65.0, 563.6099999999998, 1, 7269, 4.0, 1823.3000000000043, 3369.2999999999997, 6326.240000000001, 4.543320561554421, 6.8673059339552625, 1.1255810481061925], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 18, 1.196808510638298, 0.35294117647058826], "isController": false}, {"data": ["500/Internal Server Error", 21, 1.3962765957446808, 0.4117647058823529], "isController": false}, {"data": ["403/Forbidden", 16, 1.0638297872340425, 0.3137254901960784], "isController": false}, {"data": ["404/Not Found", 75, 4.986702127659575, 1.4705882352941178], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 217, 14.428191489361701, 4.254901960784314], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 1157, 76.92819148936171, 22.686274509803923], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5100, 1504, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 1157, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 217, "404/Not Found", 75, "500/Internal Server Error", 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 18], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get Posts on TownCentre", 300, 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 9, "500/Internal Server Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Msg on Main", 300, 58, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 48, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "404/Not Found", 1, "", ""], "isController": false}, {"data": ["Delete File on Main", 300, 170, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 129, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 29, "404/Not Found", 7, "500/Internal Server Error", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2], "isController": false}, {"data": ["Upload Bee File", 300, 136, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 78, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 57, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Get Bee Movie File", 300, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 15, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 4, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 17, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "500/Internal Server Error", 2, "", ""], "isController": false}, {"data": ["Post File", 300, 136, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 127, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", ""], "isController": false}, {"data": ["Update Msg to Main", 300, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 30, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "403/Forbidden", 2, "", ""], "isController": false}, {"data": ["Create New Channel", 300, 182, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 157, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 18, "500/Internal Server Error", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", ""], "isController": false}, {"data": ["Delete Channel", 300, 214, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 155, "404/Not Found", 38, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 14, "500/Internal Server Error", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1], "isController": false}, {"data": ["Logout", 300, 101, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 92, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": ["Post Msg to Main", 300, 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 19, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", ""], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 184, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 165, "403/Forbidden", 14, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 5, "", "", "", ""], "isController": false}, {"data": ["Delete Msg on Custom", 300, 195, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 154, "404/Not Found", 29, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 10, "500/Internal Server Error", 2, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
