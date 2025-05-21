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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 340, 0, 0.0, 110.95294117647069, 2, 2018, 27.0, 179.90000000000003, 553.0999999999989, 1801.3599999999974, 6.6501065972969275, 13.908170004351907, 23.50740863438105], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 20, 0, 0.0, 65.00000000000001, 16, 100, 77.5, 91.7, 99.6, 100.0, 141.84397163120568, 131.31648936170214, 76.04720744680851], "isController": false}, {"data": ["Get User Data", 20, 0, 0.0, 48.650000000000006, 22, 73, 52.5, 71.9, 72.95, 73.0, 250.0, 910.400390625, 125.244140625], "isController": false}, {"data": ["Get Channels", 20, 0, 0.0, 4.1499999999999995, 2, 7, 4.0, 5.900000000000002, 6.949999999999999, 7.0, 322.5806451612903, 259.89163306451616, 172.9460685483871], "isController": false}, {"data": ["Login", 20, 0, 0.0, 1140.8, 301, 2018, 1133.5, 1917.8000000000002, 2013.3999999999999, 2018.0, 9.886307464162137, 14.186947757043994, 5.00494315373208], "isController": false}, {"data": ["Delete Msg on Main", 20, 0, 0.0, 40.6, 12, 77, 45.5, 66.9, 76.5, 77.0, 60.24096385542169, 21.178463855421686, 33.061935240963855], "isController": false}, {"data": ["Delete File on Main", 20, 0, 0.0, 19.55, 12, 36, 18.0, 31.300000000000015, 35.8, 36.0, 31.34796238244514, 11.02076802507837, 17.2046434169279], "isController": false}, {"data": ["Upload Bee File", 20, 0, 0.0, 86.50000000000001, 8, 230, 78.0, 198.60000000000002, 228.45, 230.0, 36.69724770642202, 25.336869266055043, 1809.561353211009], "isController": false}, {"data": ["Get Bee Movie File", 20, 0, 0.0, 9.3, 5, 16, 9.0, 14.800000000000004, 15.95, 16.0, 151.51515151515153, 3234.789299242424, 79.90056818181817], "isController": false}, {"data": ["Get Stats on TownCentre", 20, 0, 0.0, 4.25, 2, 12, 3.0, 8.900000000000002, 11.849999999999998, 12.0, 153.84615384615387, 71.66466346153845, 82.48197115384615], "isController": false}, {"data": ["Post File", 20, 0, 0.0, 109.55, 45, 204, 96.0, 179.9, 202.79999999999998, 204.0, 29.940119760479043, 35.02760104790419, 26.139127994011975], "isController": false}, {"data": ["Update Msg to Main", 20, 0, 0.0, 50.349999999999994, 19, 86, 57.0, 75.9, 85.5, 86.0, 67.56756756756756, 53.5789695945946, 90.4639991554054], "isController": false}, {"data": ["Create New Channel", 20, 0, 0.0, 65.39999999999999, 45, 96, 63.0, 93.60000000000002, 95.95, 96.0, 29.027576197387518, 26.051115747460088, 29.112617924528305], "isController": false}, {"data": ["Delete Channel", 20, 0, 0.0, 28.049999999999997, 21, 36, 29.0, 32.900000000000006, 35.849999999999994, 36.0, 30.534351145038165, 10.73473282442748, 16.84756679389313], "isController": false}, {"data": ["Logout", 20, 0, 0.0, 13.600000000000003, 11, 19, 13.0, 16.900000000000002, 18.9, 19.0, 31.25, 12.664794921875, 16.4794921875], "isController": false}, {"data": ["Post Msg to Main", 20, 0, 0.0, 161.6, 67, 239, 170.0, 220.80000000000004, 238.2, 239.0, 65.78947368421052, 51.590768914473685, 55.895353618421055], "isController": false}, {"data": ["Post Msg to Custom Channel", 20, 0, 0.0, 21.2, 16, 29, 21.0, 26.700000000000006, 28.9, 29.0, 31.10419906687403, 24.391281104199066, 26.426419129082426], "isController": false}, {"data": ["Delete Msg on Custom", 20, 0, 0.0, 17.65, 13, 22, 17.0, 21.900000000000002, 22.0, 22.0, 31.29890453834116, 11.003521126760564, 17.177719092331767], "isController": false}]}, function(index, item){
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
