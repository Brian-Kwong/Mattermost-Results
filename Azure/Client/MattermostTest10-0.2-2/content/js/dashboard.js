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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9823529411764705, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.7, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 170, 0, 0.0, 81.49411764705887, 3, 1071, 30.5, 150.60000000000002, 354.39999999999895, 1007.0999999999992, 3.3492257378147285, 7.003475745202726, 11.83909356037472], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 10, 0, 0.0, 68.6, 52, 96, 60.0, 95.6, 96.0, 96.0, 94.33962264150944, 87.33785377358491, 50.578567216981135], "isController": false}, {"data": ["Get User Data", 10, 0, 0.0, 30.6, 25, 35, 31.0, 35.0, 35.0, 35.0, 256.4102564102564, 931.9911858974359, 128.45552884615384], "isController": false}, {"data": ["Get Channels", 10, 0, 0.0, 10.299999999999999, 5, 19, 9.5, 18.700000000000003, 19.0, 19.0, 454.5454545454545, 366.2109375, 243.69673295454547], "isController": false}, {"data": ["Login", 10, 0, 0.0, 647.8000000000001, 227, 1071, 646.0, 1062.0, 1071.0, 1071.0, 9.24214417744917, 13.271141404805913, 4.686958468114602], "isController": false}, {"data": ["Delete Msg on Main", 10, 0, 0.0, 38.5, 19, 55, 39.5, 54.300000000000004, 55.0, 55.0, 84.7457627118644, 29.79343220338983, 46.51085805084746], "isController": false}, {"data": ["Delete File on Main", 10, 0, 0.0, 20.599999999999998, 13, 31, 17.5, 31.0, 31.0, 31.0, 35.97122302158273, 12.64613309352518, 19.742018884892083], "isController": false}, {"data": ["Upload Bee File", 10, 0, 0.0, 56.8, 13, 114, 51.5, 113.6, 114.0, 114.0, 47.393364928909946, 32.72178613744076, 2336.937203791469], "isController": false}, {"data": ["Get Bee Movie File", 10, 0, 0.0, 10.3, 7, 14, 10.0, 13.9, 14.0, 14.0, 181.8181818181818, 3881.747159090909, 95.88068181818181], "isController": false}, {"data": ["Get Stats on TownCentre", 10, 0, 0.0, 6.3999999999999995, 3, 10, 6.5, 9.9, 10.0, 10.0, 175.43859649122805, 81.72286184210526, 94.05838815789474], "isController": false}, {"data": ["Post File", 10, 0, 0.0, 120.9, 60, 151, 125.0, 150.6, 151.0, 151.0, 32.57328990228013, 38.10820439739414, 28.438008957654723], "isController": false}, {"data": ["Update Msg to Main", 10, 0, 0.0, 77.2, 40, 106, 77.5, 105.3, 106.0, 106.0, 82.64462809917356, 65.53460743801654, 110.65018078512396], "isController": false}, {"data": ["Create New Channel", 10, 0, 0.0, 71.7, 49, 91, 76.0, 90.6, 91.0, 91.0, 28.735632183908045, 25.78910739942529, 28.819818606321842], "isController": false}, {"data": ["Delete Channel", 10, 0, 0.0, 27.2, 23, 32, 26.0, 31.9, 32.0, 32.0, 30.395136778115504, 10.685790273556231, 16.770754179331306], "isController": false}, {"data": ["Logout", 10, 0, 0.0, 12.0, 10, 14, 12.0, 13.9, 14.0, 14.0, 31.645569620253166, 12.82510878164557, 16.68809335443038], "isController": false}, {"data": ["Post Msg to Main", 10, 0, 0.0, 151.5, 126, 174, 152.0, 173.7, 174.0, 174.0, 52.35602094240838, 41.056528141361255, 44.48216623036649], "isController": false}, {"data": ["Post Msg to Custom Channel", 10, 0, 0.0, 19.7, 17, 26, 19.0, 25.700000000000003, 26.0, 26.0, 31.545741324921135, 24.73752957413249, 26.801557570977916], "isController": false}, {"data": ["Delete Msg on Custom", 10, 0, 0.0, 15.3, 13, 18, 15.0, 17.9, 18.0, 18.0, 31.545741324921135, 11.090299684542586, 17.313190063091483], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 170, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
