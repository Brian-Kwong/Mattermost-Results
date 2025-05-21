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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9313235294117647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.0625, 500, 1500, "Login"], "isController": false}, {"data": [0.9975, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.995, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.9475, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.94, 500, 1500, "Post File"], "isController": false}, {"data": [0.9975, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.905, 500, 1500, "Create New Channel"], "isController": false}, {"data": [0.99, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [0.9975, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3400, 0, 0.0, 509.0973529411775, 1, 15865, 20.0, 392.8000000000002, 2163.949999999989, 12773.759999999973, 49.19764430103171, 105.94327495785643, 173.96031823369606], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 200, 0, 0.0, 15.02, 2, 188, 10.0, 29.0, 34.0, 166.3500000000006, 10.60389162822756, 21.091181869996287, 5.695449605005036], "isController": false}, {"data": ["Get User Data", 200, 0, 0.0, 8.984999999999994, 3, 55, 8.0, 14.900000000000006, 19.0, 31.910000000000082, 10.616838305552605, 38.72356987870262, 5.329155165091835], "isController": false}, {"data": ["Get Channels", 200, 0, 0.0, 5.5150000000000015, 1, 57, 4.0, 10.0, 12.949999999999989, 31.950000000000045, 10.619093129446744, 8.555421710735903, 5.703614473823936], "isController": false}, {"data": ["Login", 200, 0, 0.0, 7535.895000000001, 147, 15865, 7343.5, 13977.5, 14849.25, 15762.94, 10.120945296290673, 14.53022802173473, 5.149278012878903], "isController": false}, {"data": ["Delete Msg on Main", 200, 0, 0.0, 46.145, 7, 591, 25.0, 98.80000000000001, 144.95, 367.39000000000055, 10.482180293501049, 3.685141509433963, 5.763151860587002], "isController": false}, {"data": ["Delete File on Main", 200, 0, 0.0, 73.23999999999997, 6, 594, 50.0, 159.50000000000003, 201.74999999999994, 510.3200000000006, 10.057832537088256, 3.5359567513200902, 5.529843474981141], "isController": false}, {"data": ["Upload Bee File", 200, 0, 0.0, 145.18500000000003, 4, 1259, 14.5, 626.5000000000005, 1000.3499999999999, 1257.3900000000006, 10.383137784238397, 7.168826575641159, 512.0063142456651], "isController": false}, {"data": ["Get Bee Movie File", 200, 0, 0.0, 10.915000000000004, 3, 63, 8.0, 20.0, 30.0, 53.91000000000008, 10.60389162822756, 226.38894411749112, 5.6022513387413175], "isController": false}, {"data": ["Get Stats on TownCentre", 200, 0, 0.0, 6.4350000000000005, 2, 35, 5.0, 12.0, 14.949999999999989, 32.0, 10.607828577490187, 4.930982815317705, 5.697564177362894], "isController": false}, {"data": ["Post File", 200, 0, 0.0, 255.27, 37, 1564, 183.0, 531.8, 750.8999999999997, 1289.2600000000007, 10.04823151125402, 11.755645850080386, 8.782389846262058], "isController": false}, {"data": ["Update Msg to Main", 200, 0, 0.0, 48.595000000000006, 10, 619, 26.0, 133.70000000000002, 176.69999999999993, 259.71000000000026, 10.498687664041995, 8.17134186351706, 14.066601049868765], "isController": false}, {"data": ["Create New Channel", 200, 0, 0.0, 295.875, 42, 1155, 205.0, 656.9, 762.4999999999999, 1136.94, 10.041168792047394, 9.011556757706597, 10.08039210764133], "isController": false}, {"data": ["Delete Channel", 200, 0, 0.0, 53.054999999999986, 13, 612, 24.0, 117.90000000000006, 176.4999999999999, 601.9100000000001, 10.114291493880854, 3.5558056033174874, 5.590516587438049], "isController": false}, {"data": ["Logout", 200, 0, 0.0, 21.519999999999992, 4, 441, 8.0, 33.60000000000002, 97.89999999999975, 367.2600000000007, 10.16002032004064, 4.11758636017272, 5.367745110490222], "isController": false}, {"data": ["Post Msg to Main", 200, 0, 0.0, 43.275, 15, 246, 30.0, 93.90000000000006, 141.89999999999998, 191.7700000000002, 10.515247108307046, 8.245843191377498, 8.944121319663513], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 0, 0.0, 47.065000000000026, 11, 445, 31.0, 95.40000000000003, 115.89999999999998, 414.42000000000144, 10.063905801841695, 7.8919105067176565, 8.560216751371208], "isController": false}, {"data": ["Delete Msg on Custom", 200, 0, 0.0, 42.66500000000001, 6, 514, 16.0, 113.9, 145.34999999999985, 424.4300000000005, 10.081153283935683, 3.5441554513836384, 5.542665330913857], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
