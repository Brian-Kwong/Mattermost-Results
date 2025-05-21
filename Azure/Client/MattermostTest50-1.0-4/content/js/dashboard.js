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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.95, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.16, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.99, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 850, 0, 0.0, 195.8682352941177, 4, 4847, 26.0, 190.79999999999995, 1116.5999999999967, 4067.000000000001, 15.629884338855891, 32.69086200536013, 55.252467165750325], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 50, 0, 0.0, 22.239999999999995, 9, 74, 11.0, 57.699999999999996, 65.49999999999996, 74.0, 13.480722566729577, 12.480200188730116, 7.227457704232947], "isController": false}, {"data": ["Get User Data", 50, 0, 0.0, 29.439999999999994, 9, 86, 12.0, 74.0, 80.35, 86.0, 13.379716350013378, 48.75025086968156, 6.70292430425475], "isController": false}, {"data": ["Get Channels", 50, 0, 0.0, 7.500000000000002, 4, 29, 5.0, 14.599999999999994, 23.349999999999987, 29.0, 13.495276653171391, 10.872659412955466, 7.235260627530364], "isController": false}, {"data": ["Login", 50, 0, 0.0, 2566.9599999999996, 219, 4847, 2527.0, 4459.599999999999, 4705.299999999999, 4847.0, 8.793527963418924, 12.622319347959902, 4.453097520225114], "isController": false}, {"data": ["Delete Msg on Main", 50, 0, 0.0, 29.520000000000003, 13, 75, 19.5, 63.8, 67.79999999999998, 75.0, 13.823610727121924, 4.859863146253802, 7.586786356096212], "isController": false}, {"data": ["Delete File on Main", 50, 0, 0.0, 33.580000000000005, 15, 70, 31.0, 55.8, 58.89999999999999, 70.0, 13.513513513513514, 4.750844594594595, 7.416596283783783], "isController": false}, {"data": ["Upload Bee File", 50, 0, 0.0, 110.42000000000002, 8, 443, 20.0, 344.09999999999997, 414.99999999999983, 443.0, 13.774104683195592, 9.51005079201102, 679.2441460055096], "isController": false}, {"data": ["Get Bee Movie File", 50, 0, 0.0, 13.340000000000002, 7, 71, 10.0, 22.699999999999996, 31.949999999999953, 71.0, 13.52082206598161, 288.66426953758787, 7.130121011357491], "isController": false}, {"data": ["Get Stats on TownCentre", 50, 0, 0.0, 6.240000000000001, 4, 18, 5.0, 10.899999999999999, 15.449999999999996, 18.0, 13.531799729364005, 6.303387178619757, 7.254841847090663], "isController": false}, {"data": ["Post File", 50, 0, 0.0, 168.61999999999995, 59, 608, 161.0, 302.0, 323.59999999999997, 608.0, 13.220518244315178, 15.46697349286092, 11.542132139079852], "isController": false}, {"data": ["Update Msg to Main", 50, 0, 0.0, 46.65999999999999, 20, 125, 26.0, 95.9, 112.89999999999999, 125.0, 13.943112102621305, 11.056452175125488, 18.667975285833798], "isController": false}, {"data": ["Create New Channel", 50, 0, 0.0, 104.33999999999999, 59, 168, 98.5, 155.7, 158.79999999999998, 168.0, 13.164823591363875, 11.81491492232754, 13.2033924104792], "isController": false}, {"data": ["Delete Channel", 50, 0, 0.0, 34.84, 23, 67, 31.0, 47.9, 59.34999999999999, 67.0, 13.099292638197536, 4.605220068116322, 7.227637051349227], "isController": false}, {"data": ["Logout", 50, 0, 0.0, 17.320000000000004, 11, 30, 16.0, 25.9, 28.349999999999987, 30.0, 13.123359580052494, 5.31854904855643, 6.920521653543307], "isController": false}, {"data": ["Post Msg to Main", 50, 0, 0.0, 79.82, 25, 195, 38.0, 178.7, 191.24999999999997, 195.0, 13.466199838405602, 10.559920381093455, 11.441009628332884], "isController": false}, {"data": ["Post Msg to Custom Channel", 50, 0, 0.0, 35.58000000000001, 20, 86, 32.5, 54.0, 65.64999999999992, 86.0, 13.255567338282079, 10.394746652969248, 11.26205428154825], "isController": false}, {"data": ["Delete Msg on Custom", 50, 0, 0.0, 23.33999999999999, 15, 54, 20.0, 37.8, 45.699999999999974, 54.0, 13.276686139139672, 4.667584970791291, 7.2866187599575145], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 850, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
