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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 340, 0, 0.0, 136.4970588235295, 3, 2027, 44.0, 371.7000000000001, 506.8999999999995, 1813.0999999999976, 6.6189067123501015, 13.842157477661189, 23.397880854812332], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 20, 0, 0.0, 57.1, 20, 131, 57.0, 65.9, 127.74999999999996, 131.0, 104.71204188481676, 96.94044502617801, 56.139561518324605], "isController": false}, {"data": ["Get User Data", 20, 0, 0.0, 70.65, 11, 97, 80.0, 94.7, 96.9, 97.0, 99.00990099009901, 360.36123143564356, 49.601639851485146], "isController": false}, {"data": ["Get Channels", 20, 0, 0.0, 13.65, 3, 25, 13.5, 24.900000000000002, 25.0, 25.0, 125.0, 100.7080078125, 67.0166015625], "isController": false}, {"data": ["Login", 20, 0, 0.0, 1134.4999999999995, 225, 2027, 1141.0, 1932.8000000000002, 2022.75, 2027.0, 9.775171065493646, 14.02746593963832, 4.948680351906159], "isController": false}, {"data": ["Delete Msg on Main", 20, 0, 0.0, 37.35000000000001, 19, 77, 37.0, 51.60000000000001, 75.74999999999999, 77.0, 75.75757575757576, 26.633522727272727, 41.57788825757576], "isController": false}, {"data": ["Delete File on Main", 20, 0, 0.0, 50.25, 21, 96, 53.0, 74.4, 94.94999999999999, 96.0, 29.455081001472752, 10.355301914580265, 16.165776877761413], "isController": false}, {"data": ["Upload Bee File", 20, 0, 0.0, 156.75, 12, 352, 133.0, 341.5000000000001, 351.7, 352.0, 33.50083752093802, 23.129972780569513, 1652.0100502512564], "isController": false}, {"data": ["Get Bee Movie File", 20, 0, 0.0, 17.849999999999998, 9, 29, 16.5, 26.900000000000002, 28.9, 29.0, 136.986301369863, 2924.604023972603, 72.2388698630137], "isController": false}, {"data": ["Get Stats on TownCentre", 20, 0, 0.0, 5.5, 4, 8, 5.0, 7.900000000000002, 8.0, 8.0, 138.88888888888889, 64.697265625, 74.462890625], "isController": false}, {"data": ["Post File", 20, 0, 0.0, 118.85000000000001, 64, 164, 114.5, 156.60000000000002, 163.65, 164.0, 29.112081513828237, 34.05886098981077, 25.41621179039301], "isController": false}, {"data": ["Update Msg to Main", 20, 0, 0.0, 62.300000000000004, 22, 114, 61.0, 89.80000000000001, 112.79999999999998, 114.0, 81.96721311475409, 64.99743852459017, 109.74321209016394], "isController": false}, {"data": ["Create New Channel", 20, 0, 0.0, 89.25, 64, 119, 89.5, 106.20000000000002, 118.39999999999999, 119.0, 27.137042062415198, 24.354435210312076, 27.21654511533243], "isController": false}, {"data": ["Delete Channel", 20, 0, 0.0, 37.05, 24, 50, 37.0, 48.900000000000006, 49.95, 50.0, 27.972027972027973, 9.833916083916085, 15.433784965034965], "isController": false}, {"data": ["Logout", 20, 0, 0.0, 15.050000000000002, 12, 21, 14.0, 19.800000000000004, 20.95, 21.0, 28.90173410404624, 11.713105130057805, 15.241148843930636], "isController": false}, {"data": ["Post Msg to Main", 20, 0, 0.0, 404.65, 338, 467, 409.0, 444.3, 465.9, 467.0, 38.75968992248062, 30.394561531007753, 32.930595930232556], "isController": false}, {"data": ["Post Msg to Custom Channel", 20, 0, 0.0, 27.45, 19, 41, 25.5, 36.7, 40.8, 41.0, 28.49002849002849, 22.34130163817664, 24.2053952991453], "isController": false}, {"data": ["Delete Msg on Custom", 20, 0, 0.0, 22.25, 15, 39, 20.0, 30.0, 38.55, 39.0, 28.368794326241133, 9.97340425531915, 15.569592198581562], "isController": false}]}, function(index, item){
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
