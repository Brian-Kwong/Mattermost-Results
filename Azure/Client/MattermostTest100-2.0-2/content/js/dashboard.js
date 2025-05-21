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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9276470588235294, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.89, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.995, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.1, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.99, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.96, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.835, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1700, 0, 0.0, 321.77235294117617, 2, 7882, 30.0, 432.7000000000003, 1564.399999999987, 6578.280000000001, 27.996903871807117, 58.571684425487064, 98.96641761087598], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 100, 0, 0.0, 228.52999999999994, 22, 1005, 26.0, 893.0, 949.5999999999999, 1004.93, 13.296104241457254, 12.309284004786598, 7.128477762265656], "isController": false}, {"data": ["Get User Data", 100, 0, 0.0, 24.939999999999994, 5, 203, 9.0, 64.9, 73.0, 202.40999999999968, 13.281976358082082, 48.50839773708328, 6.653958859078231], "isController": false}, {"data": ["Get Channels", 100, 0, 0.0, 21.91999999999999, 3, 590, 5.0, 55.000000000000114, 104.0999999999998, 585.9099999999979, 13.326226012793176, 10.736461387260128, 7.144627032249467], "isController": false}, {"data": ["Login", 100, 0, 0.0, 3999.34, 190, 7882, 3921.0, 7157.400000000001, 7565.949999999999, 7881.0199999999995, 10.309278350515465, 14.799754349226806, 5.222696520618557], "isController": false}, {"data": ["Delete Msg on Main", 100, 0, 0.0, 35.81, 14, 115, 25.0, 84.9, 94.89999999999998, 114.88999999999994, 13.770311209033324, 4.841125034425779, 7.5575340815202425], "isController": false}, {"data": ["Delete File on Main", 100, 0, 0.0, 91.64999999999998, 15, 810, 48.5, 219.40000000000003, 276.2999999999996, 808.2799999999991, 10.25325540859223, 3.604660104583205, 5.6272749410437815], "isController": false}, {"data": ["Upload Bee File", 100, 0, 0.0, 106.59999999999998, 7, 423, 53.0, 309.6, 386.6499999999999, 422.90999999999997, 13.762730525736306, 9.502197736030828, 678.64615589733], "isController": false}, {"data": ["Get Bee Movie File", 100, 0, 0.0, 12.200000000000001, 5, 79, 9.0, 22.900000000000006, 30.94999999999999, 79.0, 13.941168269901018, 297.6384967935313, 7.351787954830614], "isController": false}, {"data": ["Get Stats on TownCentre", 100, 0, 0.0, 6.330000000000002, 2, 97, 4.0, 7.900000000000006, 19.499999999999886, 96.48999999999974, 13.97233477714126, 6.5085973522425595, 7.491027141260305], "isController": false}, {"data": ["Post File", 100, 0, 0.0, 287.14000000000004, 63, 3165, 195.0, 406.0, 868.049999999999, 3146.1899999999905, 10.182262498727217, 11.91245163425313, 8.88959245494349], "isController": false}, {"data": ["Update Msg to Main", 100, 0, 0.0, 59.52, 19, 226, 33.0, 173.60000000000002, 199.69999999999993, 225.88999999999993, 13.877324451845684, 11.004284623924507, 18.57989435886761], "isController": false}, {"data": ["Create New Channel", 100, 0, 0.0, 412.25999999999993, 56, 1770, 221.5, 1116.8000000000002, 1345.1499999999992, 1767.2599999999986, 10.204081632653061, 9.157764668367346, 10.233976403061224], "isController": false}, {"data": ["Delete Channel", 100, 0, 0.0, 39.23999999999997, 22, 149, 33.5, 53.900000000000006, 81.0, 148.95999999999998, 10.482180293501049, 3.685141509433963, 5.783624868972747], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 16.39, 10, 41, 15.0, 23.900000000000006, 28.0, 40.87999999999994, 10.504201680672269, 4.257073923319328, 5.539325105042017], "isController": false}, {"data": ["Post Msg to Main", 100, 0, 0.0, 63.13000000000002, 24, 231, 36.0, 162.8, 196.79999999999995, 230.8499999999999, 13.856172925038106, 10.865729354302342, 11.772334418733546], "isController": false}, {"data": ["Post Msg to Custom Channel", 100, 0, 0.0, 38.36, 18, 111, 36.0, 53.0, 88.89999999999975, 110.91999999999996, 10.359473738734073, 8.123688879104941, 8.801506008494767], "isController": false}, {"data": ["Delete Msg on Custom", 100, 0, 0.0, 26.769999999999996, 13, 137, 21.0, 44.0, 57.849999999999966, 136.83999999999992, 10.452597470471412, 3.6747412982126058, 5.736679471098568], "isController": false}]}, function(index, item){
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
