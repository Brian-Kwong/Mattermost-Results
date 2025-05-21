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

    var data = {"OkPercent": 60.64705882352941, "KoPercent": 39.35294117647059};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4883823529411765, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9075, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.995, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.985, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.02, 500, 1500, "Login"], "isController": false}, {"data": [0.645, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.2925, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.315, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [0.965, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [0.9975, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.2725, 500, 1500, "Post File"], "isController": false}, {"data": [0.75, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.015, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [0.4125, 500, 1500, "Logout"], "isController": false}, {"data": [0.73, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3400, 1338, 39.35294117647059, 1339.854117647059, 0, 26947, 41.0, 4347.500000000002, 9234.699999999995, 21934.539999999968, 39.69087810230908, 125.1892088418727, 71.55693260649413], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 200, 0, 0.0, 302.6600000000001, 16, 1581, 129.5, 1120.8000000000002, 1318.75, 1537.4500000000005, 6.968641114982578, 29.894925958188153, 3.7361171602787455], "isController": false}, {"data": ["Get User Data", 200, 0, 0.0, 43.755000000000024, 7, 777, 17.0, 94.70000000000002, 137.79999999999995, 554.3100000000006, 7.121492664862555, 25.9668469479953, 3.5677009151118075], "isController": false}, {"data": ["Get Channels", 200, 0, 0.0, 63.48000000000004, 7, 832, 24.0, 131.60000000000008, 262.5999999999999, 812.4000000000005, 7.121492664862555, 34.5511317609671, 3.818065891610882], "isController": false}, {"data": ["Login", 200, 0, 0.0, 12381.820000000003, 602, 26947, 11767.0, 24081.2, 25515.949999999997, 26820.54, 6.503007641033978, 9.336102615428386, 3.2958627154121283], "isController": false}, {"data": ["Delete Msg on Main", 200, 55, 27.5, 584.1050000000002, 0, 7400, 98.0, 2097.200000000001, 3658.2999999999984, 7318.740000000002, 6.291682395872656, 5.413703923257204, 2.607054450578835], "isController": false}, {"data": ["Delete File on Main", 200, 128, 64.0, 591.0800000000003, 1, 9442, 39.0, 2008.2000000000014, 4539.199999999999, 8336.87000000001, 6.2990142042770305, 10.643427077099933, 1.2617405258889482], "isController": false}, {"data": ["Upload Bee File", 200, 103, 51.5, 2750.550000000002, 2, 12258, 478.5, 10511.800000000003, 11636.849999999999, 12246.73, 6.291088672894844, 9.436633009342266, 150.45673058019565], "isController": false}, {"data": ["Get Bee Movie File", 200, 2, 1.0, 98.56500000000001, 6, 1768, 29.0, 244.10000000000022, 482.89999999999975, 1080.5500000000013, 6.987387765084024, 147.72265747825176, 3.6847552667435277], "isController": false}, {"data": ["Get Stats on TownCentre", 200, 0, 0.0, 56.16000000000001, 5, 1135, 23.0, 106.70000000000002, 222.34999999999985, 480.2300000000007, 7.113134402674539, 3.313442490308354, 3.8135847529964075], "isController": false}, {"data": ["Post File", 200, 114, 57.0, 750.6050000000001, 1, 10629, 65.5, 2393.7000000000025, 4892.149999999997, 8426.910000000002, 6.296039790971479, 11.923525005115533, 2.391080971006737], "isController": false}, {"data": ["Update Msg to Main", 200, 41, 20.5, 554.3300000000003, 2, 8371, 156.5, 1494.7000000000007, 3663.499999999993, 7277.860000000001, 6.300204756654591, 6.791885287053079, 6.873806406520711], "isController": false}, {"data": ["Create New Channel", 200, 178, 89.0, 2477.3499999999976, 1, 12545, 14.0, 10199.1, 10853.049999999997, 12072.58, 6.322911068255825, 13.744798417691506, 0.8243865788308937], "isController": false}, {"data": ["Delete Channel", 200, 200, 100.0, 5.35, 1, 42, 3.0, 12.0, 17.0, 37.99000000000001, 7.880220646178092, 15.563050999802995, 1.016232946710008], "isController": false}, {"data": ["Logout", 200, 97, 48.5, 191.92000000000004, 1, 1108, 14.0, 888.4000000000001, 991.7999999999997, 1105.91, 7.893905904641617, 11.196511078603569, 2.143843000078939], "isController": false}, {"data": ["Post Msg to Main", 200, 25, 12.5, 1211.235, 33, 10406, 220.0, 4865.3, 6678.849999999999, 9039.51000000001, 6.173220569170936, 5.656303774538551, 4.6678952018643125], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 195, 97.5, 673.0100000000002, 0, 8911, 8.0, 2603.9000000000005, 5346.799999999998, 8805.380000000003, 6.365372374283896, 13.891834669398472, 0.7397258911521324], "isController": false}, {"data": ["Delete Msg on Custom", 200, 200, 100.0, 41.545000000000016, 1, 3598, 4.5, 40.0, 50.94999999999999, 1073.3700000000006, 6.912283127116886, 14.524873688826293, 0.6938609205433054], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 24, 1.7937219730941705, 0.7058823529411765], "isController": false}, {"data": ["500/Internal Server Error", 16, 1.195814648729447, 0.47058823529411764], "isController": false}, {"data": ["403/Forbidden", 24, 1.7937219730941705, 0.7058823529411765], "isController": false}, {"data": ["404/Not Found", 90, 6.726457399103139, 2.6470588235294117], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 176, 13.153961136023916, 5.176470588235294], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 1008, 75.33632286995515, 29.647058823529413], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3400, 1338, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 1008, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 176, "404/Not Found", 90, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 24, "403/Forbidden", 24], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Msg on Main", 200, 55, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 37, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 9, "500/Internal Server Error", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", ""], "isController": false}, {"data": ["Delete File on Main", 200, 128, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 113, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "404/Not Found", 1, "", ""], "isController": false}, {"data": ["Upload Bee File", 200, 103, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 51, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 49, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", "", "", ""], "isController": false}, {"data": ["Get Bee Movie File", 200, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Post File", 200, 114, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 103, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "500/Internal Server Error", 1, "", ""], "isController": false}, {"data": ["Update Msg to Main", 200, 41, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 22, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "404/Not Found", 3, "403/Forbidden", 1], "isController": false}, {"data": ["Create New Channel", 200, 178, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 127, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 45, "500/Internal Server Error", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", ""], "isController": false}, {"data": ["Delete Channel", 200, 200, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 151, "404/Not Found", 49, "", "", "", "", "", ""], "isController": false}, {"data": ["Logout", 200, 97, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 97, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Post Msg to Main", 200, 25, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 22, "500/Internal Server Error", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 195, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 152, "403/Forbidden", 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 18, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", ""], "isController": false}, {"data": ["Delete Msg on Custom", 200, 200, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 52.159.140.65:8065 [/52.159.140.65] failed: Connection refused", 157, "404/Not Found", 37, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 52.159.140.65:8065 failed to respond", 2, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
