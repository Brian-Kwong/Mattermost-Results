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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9720588235294118, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.525, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 340, 0, 0.0, 78.37941176470588, 2, 1770, 12.5, 98.0, 409.34999999999985, 1562.0199999999982, 6.801224220359664, 14.031998415964873, 24.047531680702527], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 20, 0, 0.0, 3.6500000000000004, 2, 6, 3.5, 5.0, 5.949999999999999, 6.0, 22.321428571428573, 10.419573102678571, 11.989048549107142], "isController": false}, {"data": ["Get User Data", 20, 0, 0.0, 8.649999999999999, 4, 17, 5.5, 16.0, 16.95, 17.0, 22.026431718061676, 80.08242703744493, 11.056236233480176], "isController": false}, {"data": ["Get Channels", 20, 0, 0.0, 6.2, 3, 12, 4.5, 11.0, 11.95, 12.0, 22.22222222222222, 17.903645833333332, 11.93576388888889], "isController": false}, {"data": ["Login", 20, 0, 0.0, 959.65, 167, 1770, 955.0, 1668.7000000000003, 1765.35, 1770.0, 11.280315848843767, 16.18736340242527, 5.732691765369431], "isController": false}, {"data": ["Delete Msg on Main", 20, 0, 0.0, 14.25, 8, 25, 13.0, 21.900000000000002, 24.849999999999998, 25.0, 24.125452352231605, 8.481604342581424, 13.264286791314838], "isController": false}, {"data": ["Delete File on Main", 20, 0, 0.0, 12.350000000000001, 7, 26, 10.5, 22.700000000000006, 25.849999999999998, 26.0, 24.66091245376079, 8.669852034525277, 13.558685265104808], "isController": false}, {"data": ["Upload Bee File", 20, 0, 0.0, 31.29999999999999, 5, 101, 14.0, 91.7, 100.55, 101.0, 24.242424242424242, 16.737689393939394, 1195.3645833333335], "isController": false}, {"data": ["Get Bee Movie File", 20, 0, 0.0, 7.199999999999998, 4, 13, 6.0, 12.700000000000006, 13.0, 13.0, 22.3463687150838, 477.0862430167598, 11.806040502793296], "isController": false}, {"data": ["Get Stats on TownCentre", 20, 0, 0.0, 3.3000000000000003, 2, 5, 3.0, 5.0, 5.0, 5.0, 22.371364653243848, 10.39918903803132, 12.015869686800894], "isController": false}, {"data": ["Post File", 20, 0, 0.0, 99.64999999999999, 36, 397, 92.5, 149.70000000000002, 384.64999999999986, 397.0, 23.64066193853428, 27.65772754137116, 20.662492612293146], "isController": false}, {"data": ["Update Msg to Main", 20, 0, 0.0, 18.1, 12, 31, 16.0, 26.700000000000006, 30.799999999999997, 31.0, 23.86634844868735, 18.57566378281623, 31.977177804295945], "isController": false}, {"data": ["Create New Channel", 20, 0, 0.0, 59.6, 32, 121, 54.0, 105.20000000000002, 120.24999999999999, 121.0, 23.837902264600714, 21.393586114421932, 23.931019070321813], "isController": false}, {"data": ["Delete Channel", 20, 0, 0.0, 22.05, 14, 36, 20.5, 33.40000000000001, 35.9, 36.0, 24.783147459727388, 8.712825278810408, 13.698497521685253], "isController": false}, {"data": ["Logout", 20, 0, 0.0, 7.15, 5, 13, 7.0, 9.0, 12.799999999999997, 13.0, 25.094102885821833, 10.169973337515684, 13.257724278544542], "isController": false}, {"data": ["Post Msg to Main", 20, 0, 0.0, 51.45000000000001, 13, 104, 46.5, 98.60000000000001, 103.75, 104.0, 22.099447513812155, 17.329937845303867, 18.797479281767956], "isController": false}, {"data": ["Post Msg to Custom Channel", 20, 0, 0.0, 18.45, 12, 34, 18.0, 25.900000000000002, 33.599999999999994, 34.0, 24.66091245376079, 19.338586621454994, 20.976225339087545], "isController": false}, {"data": ["Delete Msg on Custom", 20, 0, 0.0, 9.450000000000001, 7, 14, 9.0, 12.900000000000002, 13.95, 14.0, 24.93765586034913, 8.76714463840399, 13.710840087281795], "isController": false}]}, function(index, item){
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
