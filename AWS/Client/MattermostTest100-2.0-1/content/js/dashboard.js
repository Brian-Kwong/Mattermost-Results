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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9485294117647058, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.125, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1700, 0, 0.0, 224.9858823529418, 1, 6763, 13.0, 83.90000000000009, 1198.7499999999882, 5686.360000000001, 29.869103048405517, 61.64620486690679, 105.61631105596065], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 100, 0, 0.0, 4.2, 2, 8, 4.0, 6.0, 6.0, 7.989999999999995, 12.88161793121216, 6.013098995233801, 6.918837756022157], "isController": false}, {"data": ["Get User Data", 100, 0, 0.0, 7.4799999999999995, 3, 37, 5.0, 14.700000000000017, 31.94999999999999, 36.989999999999995, 12.856775520699408, 46.894209830611985, 6.45349865003857], "isController": false}, {"data": ["Get Channels", 100, 0, 0.0, 2.83, 1, 7, 3.0, 4.0, 4.0, 6.97999999999999, 12.883277505797475, 10.37959369363566, 6.919729129090441], "isController": false}, {"data": ["Login", 100, 0, 0.0, 3487.17, 144, 6763, 3483.0, 6159.700000000001, 6488.799999999999, 6762.2, 11.56336725254394, 16.60009449439177, 5.880604619565218], "isController": false}, {"data": ["Delete Msg on Main", 100, 0, 0.0, 15.530000000000001, 7, 101, 11.0, 26.700000000000017, 39.799999999999955, 100.83999999999992, 12.980269989615785, 4.563376168224299, 7.136613285306335], "isController": false}, {"data": ["Delete File on Main", 100, 0, 0.0, 21.75, 7, 97, 15.0, 42.80000000000001, 52.89999999999998, 96.86999999999993, 13.053126223730583, 4.588989688030283, 7.1766699843362485], "isController": false}, {"data": ["Upload Bee File", 100, 0, 0.0, 12.159999999999998, 4, 66, 7.0, 25.700000000000017, 51.449999999999875, 65.99, 12.988699831146903, 8.967783965450058, 640.4981572282114], "isController": false}, {"data": ["Get Bee Movie File", 100, 0, 0.0, 6.4300000000000015, 4, 50, 5.5, 9.0, 10.949999999999989, 49.659999999999826, 12.88161793121216, 275.01751094937526, 6.805620410923612], "isController": false}, {"data": ["Get Stats on TownCentre", 100, 0, 0.0, 3.5600000000000005, 1, 43, 3.0, 4.0, 5.949999999999989, 42.66999999999983, 12.884937508053087, 5.9894826697590515, 6.92062073186445], "isController": false}, {"data": ["Post File", 100, 0, 0.0, 86.04999999999993, 34, 288, 57.5, 180.50000000000003, 223.49999999999966, 287.96, 12.894906511927788, 15.086033204384268, 11.270450515796261], "isController": false}, {"data": ["Update Msg to Main", 100, 0, 0.0, 16.710000000000008, 10, 39, 15.0, 23.900000000000006, 31.0, 38.989999999999995, 12.97521733489036, 10.098875210847282, 17.384763851044504], "isController": false}, {"data": ["Create New Channel", 100, 0, 0.0, 71.18999999999994, 31, 202, 52.0, 145.0, 167.84999999999997, 201.92999999999995, 13.007284079084286, 11.673529363943809, 13.058093782518212], "isController": false}, {"data": ["Delete Channel", 100, 0, 0.0, 22.029999999999994, 14, 63, 19.0, 31.700000000000017, 48.94999999999999, 62.97999999999999, 13.189132155104195, 4.636804273278818, 7.29008671854392], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 7.739999999999998, 5, 22, 7.0, 10.0, 12.949999999999989, 21.949999999999974, 13.21003963011889, 5.353678170409511, 6.979132265521796], "isController": false}, {"data": ["Post Msg to Main", 100, 0, 0.0, 26.830000000000002, 12, 101, 19.0, 77.00000000000023, 97.94999999999999, 101.0, 12.855122766422419, 10.080726153747268, 10.934386649955007], "isController": false}, {"data": ["Post Msg to Custom Channel", 100, 0, 0.0, 19.77, 10, 49, 17.5, 31.900000000000006, 35.849999999999966, 48.89999999999995, 13.170025023047543, 10.327666106940603, 11.202238081127355], "isController": false}, {"data": ["Delete Msg on Custom", 100, 0, 0.0, 13.329999999999998, 6, 53, 10.0, 22.900000000000006, 39.849999999999966, 52.93999999999997, 13.197835554968986, 4.639864062293784, 7.256231852976112], "isController": false}]}, function(index, item){
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
