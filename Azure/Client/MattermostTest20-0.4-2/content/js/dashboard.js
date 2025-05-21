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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9676470588235294, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.45, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 340, 0, 0.0, 105.67941176470595, 2, 1988, 23.5, 172.50000000000017, 485.1999999999989, 1767.0999999999976, 6.688963210702341, 13.988667033494, 23.646453251032856], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 20, 0, 0.0, 118.24999999999999, 26, 214, 89.5, 210.4, 213.85, 214.0, 79.05138339920948, 73.1842885375494, 42.38204051383399], "isController": false}, {"data": ["Get User Data", 20, 0, 0.0, 34.04999999999999, 7, 48, 38.0, 47.900000000000006, 48.0, 48.0, 121.21212121212122, 441.16950757575756, 60.72443181818181], "isController": false}, {"data": ["Get Channels", 20, 0, 0.0, 5.1499999999999995, 2, 8, 5.0, 8.0, 8.0, 8.0, 136.986301369863, 110.36494006849315, 73.44285102739727], "isController": false}, {"data": ["Login", 20, 0, 0.0, 1104.9499999999998, 242, 1988, 1108.5, 1891.3000000000002, 1983.6499999999999, 1988.0, 10.025062656641603, 14.386062813283207, 5.075187969924812], "isController": false}, {"data": ["Delete Msg on Main", 20, 0, 0.0, 19.6, 12, 27, 18.0, 27.0, 27.0, 27.0, 65.35947712418302, 22.977941176470587, 35.87111928104575], "isController": false}, {"data": ["Delete File on Main", 20, 0, 0.0, 17.0, 12, 35, 15.0, 24.800000000000004, 34.49999999999999, 35.0, 33.222591362126245, 11.679817275747508, 18.233492524916944], "isController": false}, {"data": ["Upload Bee File", 20, 0, 0.0, 83.19999999999999, 9, 167, 92.5, 164.20000000000005, 166.95, 167.0, 43.47826086956522, 30.01868206521739, 2144.1236413043475], "isController": false}, {"data": ["Get Bee Movie File", 20, 0, 0.0, 7.750000000000001, 5, 12, 7.0, 10.900000000000002, 11.95, 12.0, 91.74311926605505, 1958.679759174312, 48.38016055045872], "isController": false}, {"data": ["Get Stats on TownCentre", 20, 0, 0.0, 4.0, 3, 6, 4.0, 5.0, 5.949999999999999, 6.0, 92.59259259259258, 43.131510416666664, 49.641927083333336], "isController": false}, {"data": ["Post File", 20, 0, 0.0, 129.25, 41, 214, 120.0, 206.4, 213.65, 214.0, 32.520325203252035, 38.046239837398375, 28.391768292682926], "isController": false}, {"data": ["Update Msg to Main", 20, 0, 0.0, 41.75000000000001, 20, 68, 44.5, 55.0, 67.35, 68.0, 65.14657980456026, 51.659201954397396, 87.2226180781759], "isController": false}, {"data": ["Create New Channel", 20, 0, 0.0, 54.6, 41, 75, 51.5, 70.60000000000001, 74.8, 75.0, 30.581039755351682, 27.44528860856269, 30.67063264525994], "isController": false}, {"data": ["Delete Channel", 20, 0, 0.0, 25.5, 18, 38, 24.5, 37.40000000000001, 38.0, 38.0, 31.746031746031743, 11.160714285714286, 17.51612103174603], "isController": false}, {"data": ["Logout", 20, 0, 0.0, 13.95, 10, 24, 11.5, 23.900000000000002, 24.0, 24.0, 32.57328990228013, 13.201089169381108, 17.177320846905538], "isController": false}, {"data": ["Post Msg to Main", 20, 0, 0.0, 101.44999999999999, 37, 129, 101.5, 128.70000000000002, 129.0, 129.0, 66.66666666666667, 52.278645833333336, 56.640625], "isController": false}, {"data": ["Post Msg to Custom Channel", 20, 0, 0.0, 20.950000000000003, 17, 28, 20.0, 25.900000000000002, 27.9, 28.0, 31.796502384737675, 24.934171303656598, 27.01460651828299], "isController": false}, {"data": ["Delete Msg on Custom", 20, 0, 0.0, 15.15, 12, 19, 15.0, 18.0, 18.95, 19.0, 31.897926634768737, 11.214114832535886, 17.506479266347686], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 340, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
