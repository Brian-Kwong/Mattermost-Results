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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9661764705882353, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.425, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 340, 0, 0.0, 115.25588235294114, 4, 1993, 29.5, 244.90000000000003, 512.499999999999, 1768.5899999999974, 6.651667807884182, 13.910288840115426, 23.513538711728454], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 20, 0, 0.0, 25.55, 10, 42, 31.0, 40.0, 41.9, 42.0, 208.33333333333334, 192.87109375, 111.6943359375], "isController": false}, {"data": ["Get User Data", 20, 0, 0.0, 50.54999999999998, 32, 66, 53.0, 65.9, 66.0, 66.0, 277.77777777777777, 1010.7421875000001, 139.16015625], "isController": false}, {"data": ["Get Channels", 20, 0, 0.0, 29.699999999999996, 6, 59, 32.0, 45.900000000000006, 58.349999999999994, 59.0, 277.77777777777777, 223.79557291666669, 148.92578125], "isController": false}, {"data": ["Login", 20, 0, 0.0, 1113.8000000000002, 249, 1993, 1112.0, 1886.5000000000002, 1988.1, 1993.0, 10.015022533800702, 14.371655138958436, 5.070105157736605], "isController": false}, {"data": ["Delete Msg on Main", 20, 0, 0.0, 21.349999999999998, 13, 43, 19.5, 32.900000000000006, 42.49999999999999, 43.0, 78.74015748031496, 27.68208661417323, 43.214812992125985], "isController": false}, {"data": ["Delete File on Main", 20, 0, 0.0, 18.45, 13, 31, 17.0, 30.50000000000001, 31.0, 31.0, 34.188034188034194, 12.01923076923077, 18.763354700854702], "isController": false}, {"data": ["Upload Bee File", 20, 0, 0.0, 118.60000000000001, 8, 260, 129.0, 227.4, 258.4, 260.0, 40.16064257028113, 27.728099899598394, 1980.405998995984], "isController": false}, {"data": ["Get Bee Movie File", 20, 0, 0.0, 12.350000000000001, 7, 19, 12.0, 16.900000000000002, 18.9, 19.0, 204.08163265306123, 4357.063137755102, 107.62117346938776], "isController": false}, {"data": ["Get Stats on TownCentre", 20, 0, 0.0, 7.5, 4, 14, 7.0, 12.0, 13.899999999999999, 14.0, 212.7659574468085, 99.11070478723404, 114.07081117021276], "isController": false}, {"data": ["Post File", 20, 0, 0.0, 107.95, 43, 184, 103.0, 171.80000000000004, 183.5, 184.0, 33.50083752093802, 39.193362646566165, 29.24780150753769], "isController": false}, {"data": ["Update Msg to Main", 20, 0, 0.0, 60.199999999999996, 21, 86, 62.5, 81.9, 85.8, 86.0, 81.63265306122449, 64.73214285714286, 109.2952806122449], "isController": false}, {"data": ["Create New Channel", 20, 0, 0.0, 59.25, 47, 87, 55.5, 78.4, 86.6, 87.0, 31.25, 28.045654296875, 31.341552734375], "isController": false}, {"data": ["Delete Channel", 20, 0, 0.0, 28.499999999999993, 20, 52, 26.5, 48.30000000000004, 51.9, 52.0, 32.206119162640896, 11.322463768115941, 17.769977858293075], "isController": false}, {"data": ["Logout", 20, 0, 0.0, 12.450000000000001, 9, 24, 11.0, 20.400000000000013, 23.849999999999998, 24.0, 32.414910858995135, 13.136902350081037, 17.093800648298217], "isController": false}, {"data": ["Post Msg to Main", 20, 0, 0.0, 254.5, 162, 317, 257.5, 290.3, 315.7, 317.0, 57.14285714285714, 44.81026785714286, 48.549107142857146], "isController": false}, {"data": ["Post Msg to Custom Channel", 20, 0, 0.0, 21.45, 16, 26, 21.5, 25.900000000000002, 26.0, 26.0, 32.62642740619902, 25.584981647634585, 27.719718597063622], "isController": false}, {"data": ["Delete Msg on Custom", 20, 0, 0.0, 17.200000000000003, 13, 27, 15.0, 25.700000000000006, 26.95, 27.0, 33.003300330033, 11.602722772277229, 18.113139438943897], "isController": false}]}, function(index, item){
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
