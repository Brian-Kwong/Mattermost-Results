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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9438235294117647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.0475, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.9975, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3400, 0, 0.0, 481.81235294117533, 1, 14573, 15.0, 119.90000000000009, 2771.849999999985, 12350.379999999986, 50.79630680969313, 109.19795117671886, 179.60867059808916], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 200, 0, 0.0, 10.749999999999998, 2, 149, 7.5, 18.0, 29.849999999999966, 71.72000000000025, 11.421392267717433, 21.98885700416881, 6.134536862543544], "isController": false}, {"data": ["Get User Data", 200, 0, 0.0, 6.569999999999997, 3, 28, 5.0, 12.900000000000006, 18.94999999999999, 24.99000000000001, 11.407060970740888, 41.6158324659214, 5.7258099013289225], "isController": false}, {"data": ["Get Channels", 200, 0, 0.0, 4.350000000000001, 1, 79, 3.0, 5.900000000000006, 14.949999999999989, 27.960000000000036, 11.416828405069072, 9.198128353693344, 6.132085569128896], "isController": false}, {"data": ["Login", 200, 0, 0.0, 7740.754999999998, 194, 14573, 7889.5, 13269.0, 13946.599999999999, 14495.300000000001, 10.829542993285683, 15.547532810131038, 5.509794390973576], "isController": false}, {"data": ["Delete Msg on Main", 200, 0, 0.0, 21.790000000000003, 7, 139, 14.0, 45.0, 60.89999999999998, 99.91000000000008, 11.490950876185005, 4.039787417408791, 6.317778655558747], "isController": false}, {"data": ["Delete File on Main", 200, 0, 0.0, 27.950000000000003, 7, 114, 23.0, 54.900000000000006, 60.94999999999999, 107.77000000000021, 11.399908800729595, 4.007780437756498, 6.267723295713634], "isController": false}, {"data": ["Upload Bee File", 200, 0, 0.0, 14.555000000000003, 4, 146, 7.0, 23.0, 55.849999999999966, 128.97000000000003, 11.494913500775906, 7.93642953618024, 566.8123886430254], "isController": false}, {"data": ["Get Bee Movie File", 200, 0, 0.0, 6.444999999999995, 3, 40, 5.0, 9.900000000000006, 13.0, 36.850000000000136, 11.435105774728417, 244.13504145225846, 6.041398656375072], "isController": false}, {"data": ["Get Stats on TownCentre", 200, 0, 0.0, 4.27, 2, 70, 3.0, 6.900000000000006, 9.949999999999989, 16.940000000000055, 11.436413540713634, 5.316145356816103, 6.142604929094237], "isController": false}, {"data": ["Post File", 200, 0, 0.0, 101.085, 30, 785, 78.0, 207.70000000000002, 232.95, 271.94000000000005, 11.390818999886092, 13.326368322132362, 9.955842778220754], "isController": false}, {"data": ["Update Msg to Main", 200, 0, 0.0, 25.174999999999986, 10, 113, 16.0, 52.70000000000002, 73.94999999999999, 107.93000000000006, 11.483033817534592, 8.937478469311591, 15.385471091462364], "isController": false}, {"data": ["Create New Channel", 200, 0, 0.0, 110.285, 37, 359, 92.0, 204.30000000000004, 237.79999999999995, 329.6400000000003, 11.358473421172196, 10.19378620513403, 11.402842457973648], "isController": false}, {"data": ["Delete Channel", 200, 0, 0.0, 28.819999999999983, 12, 106, 22.0, 50.900000000000006, 68.74999999999994, 105.87000000000012, 11.399259048161868, 4.007552009119407, 6.300762325448845], "isController": false}, {"data": ["Logout", 200, 0, 0.0, 10.609999999999994, 4, 38, 8.0, 19.0, 24.0, 33.99000000000001, 11.410965938266674, 4.624561390996748, 6.028645090431905], "isController": false}, {"data": ["Post Msg to Main", 200, 0, 0.0, 25.914999999999996, 12, 151, 18.0, 40.0, 89.39999999999986, 146.92000000000007, 11.42791840466259, 8.961541483343808, 9.720426689903434], "isController": false}, {"data": ["Post Msg to Custom Channel", 200, 0, 0.0, 28.814999999999998, 10, 100, 26.0, 49.80000000000001, 57.0, 95.87000000000012, 11.390818999886092, 8.932448883699738, 9.688870457910923], "isController": false}, {"data": ["Delete Msg on Custom", 200, 0, 0.0, 22.670000000000016, 7, 108, 16.0, 47.0, 61.849999999999966, 99.8900000000001, 11.401858502935978, 4.00846587993843, 6.268795251125933], "isController": false}]}, function(index, item){
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
