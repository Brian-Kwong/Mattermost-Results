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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9170588235294118, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.88, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.99, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.99, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.065, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.98, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.9, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.785, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1700, 0, 0.0, 396.7058823529407, 2, 11019, 26.0, 599.0, 2108.7499999999845, 8479.310000000001, 27.636883860059825, 57.918164087901545, 97.69397129828326], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 100, 0, 0.0, 254.04000000000002, 26, 1240, 34.0, 938.7000000000003, 1159.75, 1239.97, 9.353661958656815, 9.304884073052099, 5.0148050930689365], "isController": false}, {"data": ["Get User Data", 100, 0, 0.0, 37.54000000000001, 5, 597, 15.0, 66.9, 74.0, 596.4399999999997, 9.345794392523365, 34.060765917056074, 4.682023948598131], "isController": false}, {"data": ["Get Channels", 100, 0, 0.0, 28.819999999999993, 3, 636, 7.0, 49.200000000000045, 65.0, 635.6899999999998, 9.3711929528629, 7.550033384874895, 5.024204034298567], "isController": false}, {"data": ["Login", 100, 0, 0.0, 5238.18, 252, 11019, 5087.5, 9162.300000000001, 10573.199999999988, 11017.8, 7.756748371082843, 11.135403132756748, 3.9295808447098977], "isController": false}, {"data": ["Delete Msg on Main", 100, 0, 0.0, 25.859999999999996, 11, 199, 17.0, 48.0, 58.799999999999955, 198.35999999999967, 9.830908375933936, 3.4561787259142744, 5.395479011010617], "isController": false}, {"data": ["Delete File on Main", 100, 0, 0.0, 104.99000000000001, 11, 1224, 49.0, 198.70000000000002, 354.44999999999965, 1221.879999999999, 9.786651008025053, 3.440619495008808, 5.37118932276375], "isController": false}, {"data": ["Upload Bee File", 100, 0, 0.0, 41.580000000000005, 6, 204, 18.0, 129.60000000000002, 158.5999999999999, 203.73999999999987, 9.819324430479183, 6.779553097996859, 484.19625760997644], "isController": false}, {"data": ["Get Bee Movie File", 100, 0, 0.0, 8.280000000000003, 5, 28, 7.0, 13.900000000000006, 15.949999999999989, 27.909999999999954, 9.992006394884092, 213.3254334032774, 5.269222122302159], "isController": false}, {"data": ["Get Stats on TownCentre", 100, 0, 0.0, 4.870000000000002, 2, 17, 4.0, 7.0, 10.0, 16.97999999999999, 9.99000999000999, 4.6535495754245755, 5.355972152847153], "isController": false}, {"data": ["Post File", 100, 0, 0.0, 344.30999999999995, 45, 2190, 177.5, 1077.2, 1330.2999999999988, 2187.829999999999, 9.742790335151987, 11.398303536632893, 8.505912655884647], "isController": false}, {"data": ["Update Msg to Main", 100, 0, 0.0, 31.389999999999993, 17, 164, 27.0, 44.0, 58.5499999999999, 163.28999999999962, 9.844457570387872, 7.806347214018508, 13.180421219728293], "isController": false}, {"data": ["Create New Channel", 100, 0, 0.0, 470.64999999999964, 49, 2117, 224.0, 1498.2000000000003, 1833.1999999999975, 2115.9599999999996, 9.751340809361286, 8.751447464651388, 9.779909190638712], "isController": false}, {"data": ["Delete Channel", 100, 0, 0.0, 32.89999999999999, 19, 72, 28.5, 54.900000000000006, 59.0, 71.94999999999997, 10.214504596527068, 3.591036772216548, 5.635932711950971], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 14.940000000000007, 9, 34, 13.0, 22.80000000000001, 28.0, 33.95999999999998, 10.240655401945725, 4.150265616999488, 5.400345622119815], "isController": false}, {"data": ["Post Msg to Main", 100, 0, 0.0, 31.959999999999987, 20, 85, 27.5, 48.0, 61.89999999999998, 84.90999999999995, 9.9601593625498, 7.810554656374503, 8.462244770916335], "isController": false}, {"data": ["Post Msg to Custom Channel", 100, 0, 0.0, 44.71, 17, 366, 29.0, 101.50000000000003, 122.59999999999991, 364.4299999999992, 9.798157946306095, 7.683516436409955, 8.324606848912405], "isController": false}, {"data": ["Delete Msg on Custom", 100, 0, 0.0, 28.97999999999999, 11, 120, 18.0, 78.0, 106.44999999999987, 119.99, 10.11326860841424, 3.555445995145631, 5.550446247977346], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1700, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
