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

    var data = {"OkPercent": 70.52941176470588, "KoPercent": 29.470588235294116};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5716666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9183333333333333, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "Login"], "isController": false}, {"data": [0.66, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.29333333333333333, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.215, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.9216666666666666, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [0.94, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.3566666666666667, 500, 1500, "Post File"], "isController": false}, {"data": [0.7133333333333334, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.25666666666666665, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.22833333333333333, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.5866666666666667, 500, 1500, "Logout"], "isController": false}, {"data": [0.8266666666666667, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.355, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 1503, 29.470588235294116, 1359.4572549019545, 0, 38150, 44.0, 3585.4000000000087, 6940.549999999995, 25201.959999999977, 52.42113702474072, 153.7972962642231, 123.44608628994541], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 300, 9, 3.0, 323.07, 16, 5816, 60.5, 581.5000000000009, 890.6999999999997, 5368.730000000004, 6.349340726787869, 36.50056581885331, 3.319349351309022], "isController": false}, {"data": ["Get User Data", 300, 0, 0.0, 21.096666666666664, 3, 324, 11.0, 38.900000000000034, 79.79999999999995, 246.17000000000075, 6.960556844547564, 25.406825514791183, 3.4938732598607887], "isController": false}, {"data": ["Get Channels", 300, 0, 0.0, 42.623333333333335, 3, 752, 16.0, 100.80000000000007, 169.74999999999994, 463.17000000000075, 6.889582950578725, 31.25645898401617, 3.7004595925959953], "isController": false}, {"data": ["Login", 300, 0, 0.0, 14822.580000000007, 214, 38150, 13452.5, 28693.300000000025, 34428.95, 37722.91, 6.811061163329247, 9.778484425373474, 3.4651938811129273], "isController": false}, {"data": ["Delete Msg on Main", 300, 76, 25.333333333333332, 478.2833333333333, 0, 6470, 183.5, 802.4000000000005, 2813.5499999999943, 5061.700000000001, 6.452306699645122, 5.119124032153995, 2.774512884449941], "isController": false}, {"data": ["Delete File on Main", 300, 187, 62.333333333333336, 876.5500000000008, 0, 6293, 33.0, 3800.2000000000007, 5163.999999999999, 6017.79, 6.384880602732729, 9.168040081087984, 1.6189371900672542], "isController": false}, {"data": ["Upload Bee File", 300, 106, 35.333333333333336, 2514.456666666667, 0, 8463, 1837.5, 6910.200000000001, 7522.7, 8194.77, 6.372403245677387, 8.083679777443816, 204.2553755536025], "isController": false}, {"data": ["Get Bee Movie File", 300, 22, 7.333333333333333, 110.31333333333333, 0, 5053, 20.0, 101.90000000000003, 167.79999999999995, 3540.7900000000027, 6.393180607352157, 127.5833277836974, 3.129953050079915], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 16, 5.333333333333333, 106.59333333333333, 0, 4525, 16.0, 94.0, 323.2499999999989, 3980.780000000014, 6.3889598773319705, 3.551862381804242, 3.271430301771871], "isController": false}, {"data": ["Post File", 300, 131, 43.666666666666664, 944.9099999999999, 0, 7158, 344.5, 2970.80000000002, 6008.699999999998, 7013.730000000001, 6.3676692208095425, 10.588364344766838, 3.242764570023136], "isController": false}, {"data": ["Update Msg to Main", 300, 58, 19.333333333333332, 537.453333333333, 0, 7227, 183.0, 1008.3000000000002, 3256.899999999999, 6099.230000000005, 6.442192063219378, 6.823355093626525, 7.049083463966673], "isController": false}, {"data": ["Create New Channel", 300, 170, 56.666666666666664, 581.08, 0, 7119, 43.0, 1718.3000000000009, 2169.9, 6477.79, 6.399590426212723, 11.219927757956825, 2.869649675754085], "isController": false}, {"data": ["Delete Channel", 300, 226, 75.33333333333333, 497.2366666666662, 0, 6812, 10.0, 2111.9000000000146, 4914.249999999999, 6107.92, 6.666962976132273, 7.790602325381128, 2.1933483502044537], "isController": false}, {"data": ["Logout", 300, 101, 33.666666666666664, 465.646666666667, 0, 4744, 20.0, 1538.7000000000014, 2832.499999999999, 4698.91, 6.6973255346698215, 7.095567870417914, 2.3571446510693397], "isController": false}, {"data": ["Post Msg to Main", 300, 36, 12.0, 416.15999999999997, 0, 6875, 147.0, 638.5000000000002, 1929.3999999999971, 5984.960000000004, 6.394543323031013, 6.154893657412342, 4.804545954119152], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 175, 58.333333333333336, 166.76333333333343, 0, 5452, 12.5, 226.90000000000038, 1053.1499999999978, 4302.750000000003, 6.632472585779979, 10.934857374204103, 2.6971839281371595], "isController": false}, {"data": ["Delete Msg on Custom", 300, 190, 63.333333333333336, 205.95666666666665, 0, 5643, 8.0, 211.4000000000002, 1357.9999999999966, 4967.5700000000015, 6.6515897299454565, 7.850997807746886, 2.2177811890270944], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 2, 0.1330671989354624, 0.0392156862745098], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 46, 3.0605455755156354, 0.9019607843137255], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 946, 62.94078509647372, 18.54901960784314], "isController": false}, {"data": ["500/Internal Server Error", 51, 3.3932135728542914, 1.0], "isController": false}, {"data": ["403/Forbidden", 20, 1.3306719893546242, 0.39215686274509803], "isController": false}, {"data": ["401/Unauthorized", 2, 0.1330671989354624, 0.0392156862745098], "isController": false}, {"data": ["404/Not Found", 183, 12.17564870259481, 3.588235294117647], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 253, 16.833000665335994, 4.96078431372549], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5100, 1503, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 946, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 253, "404/Not Found", 183, "500/Internal Server Error", 51, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 46], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get Posts on TownCentre", 300, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 8, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Msg on Main", 300, 76, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 47, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 16, "404/Not Found", 8, "500/Internal Server Error", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2], "isController": false}, {"data": ["Delete File on Main", 300, 187, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 111, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 47, "404/Not Found", 14, "500/Internal Server Error", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3], "isController": false}, {"data": ["Upload Bee File", 300, 106, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 58, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 35, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "500/Internal Server Error", 1, "", ""], "isController": false}, {"data": ["Get Bee Movie File", 300, 22, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 14, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": ["Get Stats on TownCentre", 300, 16, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 3, "500/Internal Server Error", 2, "", ""], "isController": false}, {"data": ["Post File", 300, 131, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 98, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 24, "500/Internal Server Error", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "400/Bad Request", 1], "isController": false}, {"data": ["Update Msg to Main", 300, 58, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 20, "403/Forbidden", 2, "500/Internal Server Error", 1, "", ""], "isController": false}, {"data": ["Create New Channel", 300, 170, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 142, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "500/Internal Server Error", 3, "401/Unauthorized", 1], "isController": false}, {"data": ["Delete Channel", 300, 226, "404/Not Found", 95, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 87, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 23, "500/Internal Server Error", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7], "isController": false}, {"data": ["Logout", 300, 101, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 67, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 28, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "400/Bad Request", 1, "", ""], "isController": false}, {"data": ["Post Msg to Main", 300, 36, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 22, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 13, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Post Msg to Custom Channel", 300, 175, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 148, "403/Forbidden", 18, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "401/Unauthorized", 1], "isController": false}, {"data": ["Delete Msg on Custom", 300, 190, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 54.188.175.189:8065 [/54.188.175.189] failed: Connection refused", 109, "404/Not Found", 66, "500/Internal Server Error", 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 54.188.175.189:8065 failed to respond", 7, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
