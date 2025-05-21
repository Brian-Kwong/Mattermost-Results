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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 170, 0, 0.0, 62.30000000000001, 1, 934, 19.0, 127.80000000000001, 295.79999999999905, 882.8799999999994, 3.4360093782844205, 7.0874404382933145, 12.149257815658098], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 10, 0, 0.0, 19.0, 5, 27, 21.5, 26.8, 27.0, 27.0, 200.0, 93.359375, 107.421875], "isController": false}, {"data": ["Get User Data", 10, 0, 0.0, 16.400000000000002, 6, 20, 17.0, 20.0, 20.0, 20.0, 156.25, 566.71142578125, 78.43017578125], "isController": false}, {"data": ["Get Channels", 10, 0, 0.0, 8.3, 3, 13, 8.0, 12.9, 13.0, 13.0, 200.0, 161.1328125, 107.421875], "isController": false}, {"data": ["Login", 10, 0, 0.0, 558.3, 182, 934, 553.5, 926.8000000000001, 934.0, 934.0, 10.70663811563169, 15.37406316916488, 5.450557079764454], "isController": false}, {"data": ["Delete Msg on Main", 10, 0, 0.0, 21.4, 12, 32, 22.0, 31.9, 32.0, 32.0, 140.84507042253523, 49.51584507042254, 77.43727992957747], "isController": false}, {"data": ["Delete File on Main", 10, 0, 0.0, 14.0, 8, 22, 13.0, 21.6, 22.0, 22.0, 58.13953488372093, 20.439680232558143, 31.965388808139537], "isController": false}, {"data": ["Upload Bee File", 10, 0, 0.0, 39.9, 18, 71, 36.5, 70.3, 71.0, 71.0, 80.64516129032258, 55.67981350806452, 3976.5782510080644], "isController": false}, {"data": ["Get Bee Movie File", 10, 0, 0.0, 10.8, 5, 20, 11.0, 19.400000000000002, 20.0, 20.0, 285.7142857142857, 6099.888392857142, 150.9486607142857], "isController": false}, {"data": ["Get Stats on TownCentre", 10, 0, 0.0, 3.5, 1, 7, 3.0, 6.800000000000001, 7.0, 7.0, 270.27027027027026, 125.63344594594595, 145.16469594594597], "isController": false}, {"data": ["Post File", 10, 0, 0.0, 92.6, 46, 116, 107.0, 115.9, 116.0, 116.0, 49.504950495049506, 57.916924504950494, 43.268487004950494], "isController": false}, {"data": ["Update Msg to Main", 10, 0, 0.0, 32.6, 21, 44, 31.0, 44.0, 44.0, 44.0, 144.92753623188406, 112.80004528985506, 194.18025362318838], "isController": false}, {"data": ["Create New Channel", 10, 0, 0.0, 48.9, 32, 69, 46.0, 68.8, 69.0, 69.0, 46.948356807511736, 42.13431631455399, 47.13174882629108], "isController": false}, {"data": ["Delete Channel", 10, 0, 0.0, 22.900000000000002, 14, 33, 23.5, 32.8, 33.0, 33.0, 49.01960784313725, 17.233455882352942, 27.09482230392157], "isController": false}, {"data": ["Logout", 10, 0, 0.0, 7.3, 6, 10, 7.0, 9.9, 10.0, 10.0, 51.02040816326531, 20.67721619897959, 26.955117984693878], "isController": false}, {"data": ["Post Msg to Main", 10, 0, 0.0, 135.5, 116, 152, 134.5, 152.0, 152.0, 152.0, 62.893081761006286, 49.31947720125786, 53.495970911949684], "isController": false}, {"data": ["Post Msg to Custom Channel", 10, 0, 0.0, 17.0, 12, 24, 17.0, 23.6, 24.0, 24.0, 53.763440860215056, 42.160198252688176, 45.73042674731183], "isController": false}, {"data": ["Delete Msg on Custom", 10, 0, 0.0, 10.700000000000001, 8, 17, 10.0, 16.5, 17.0, 17.0, 55.248618784530386, 19.423342541436465, 30.37594958563536], "isController": false}]}, function(index, item){
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
