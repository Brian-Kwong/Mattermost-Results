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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9067647058823529, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.895, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.99, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.995, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.07, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.99, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.91, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.835, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.735, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [0.995, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1700, 0, 0.0, 450.5211764705886, 3, 11575, 41.0, 712.3000000000006, 2317.749999999999, 8777.060000000001, 26.627404297976316, 55.9344511866816, 94.12622221743625], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 100, 0, 0.0, 249.14000000000013, 39, 1086, 72.0, 882.0000000000007, 1017.8, 1086.0, 8.893632159373887, 9.594787358813589, 4.768168022945571], "isController": false}, {"data": ["Get User Data", 100, 0, 0.0, 43.450000000000024, 7, 592, 17.0, 68.70000000000002, 151.49999999999966, 591.99, 8.87784090909091, 32.35634890469638, 4.447590221058239], "isController": false}, {"data": ["Get Channels", 100, 0, 0.0, 34.07000000000001, 3, 547, 9.0, 67.80000000000001, 102.84999999999974, 545.7999999999994, 8.906305664410404, 7.175490403455647, 4.774962704845031], "isController": false}, {"data": ["Login", 100, 0, 0.0, 5464.909999999997, 267, 11575, 5187.0, 10401.600000000006, 11148.399999999998, 11574.08, 7.475517679599312, 10.731675053263062, 3.7871089369813857], "isController": false}, {"data": ["Delete Msg on Main", 100, 0, 0.0, 52.25000000000001, 13, 202, 38.0, 100.0, 154.84999999999974, 201.98, 9.260974254491572, 3.2558112613446935, 5.082683135765882], "isController": false}, {"data": ["Delete File on Main", 100, 0, 0.0, 119.64000000000001, 14, 1023, 60.5, 318.00000000000006, 457.3999999999994, 1020.8199999999989, 7.953551260637876, 2.796170365068003, 4.365132625467271], "isController": false}, {"data": ["Upload Bee File", 100, 0, 0.0, 225.77, 10, 1734, 133.0, 605.2, 642.8499999999999, 1725.5499999999956, 8.007046200656578, 5.528302406117383, 394.83526753543117], "isController": false}, {"data": ["Get Bee Movie File", 100, 0, 0.0, 14.580000000000002, 7, 37, 13.0, 21.900000000000006, 25.94999999999999, 36.949999999999974, 9.375585974123384, 200.16509820926308, 4.944156666041628], "isController": false}, {"data": ["Get Stats on TownCentre", 100, 0, 0.0, 8.89, 3, 52, 6.5, 15.0, 21.94999999999999, 51.949999999999974, 9.370314842578711, 4.364882988193403, 5.023733250562219], "isController": false}, {"data": ["Post File", 100, 0, 0.0, 525.1, 60, 3084, 312.5, 1417.9000000000003, 2086.9499999999994, 3075.889999999996, 7.92895654931811, 9.276259712971774, 6.922350737392959], "isController": false}, {"data": ["Update Msg to Main", 100, 0, 0.0, 58.48000000000001, 19, 277, 42.0, 135.0, 184.4999999999999, 276.3999999999997, 9.27299703264095, 7.353196865727003, 12.415311456787833], "isController": false}, {"data": ["Create New Channel", 100, 0, 0.0, 631.48, 65, 2384, 216.5, 1866.2000000000003, 2246.149999999999, 2383.3799999999997, 7.908264136022143, 7.09735814551206, 7.931432878608145], "isController": false}, {"data": ["Delete Channel", 100, 0, 0.0, 45.08999999999998, 22, 120, 40.0, 66.0, 91.94999999999999, 119.88999999999994, 8.17460966238862, 2.8738862094334996, 4.510404745360908], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 21.770000000000003, 11, 78, 20.0, 32.0, 34.0, 77.78999999999989, 8.204791598293404, 3.3251840950114864, 4.3267455694125365], "isController": false}, {"data": ["Post Msg to Main", 100, 0, 0.0, 56.400000000000006, 24, 269, 45.0, 97.40000000000003, 117.69999999999993, 268.3499999999997, 9.350163627863488, 7.3322083917718555, 7.94398667601683], "isController": false}, {"data": ["Post Msg to Custom Channel", 100, 0, 0.0, 79.01000000000002, 21, 518, 43.0, 198.1000000000001, 293.94999999999953, 517.6799999999998, 7.96305144131231, 6.244463190794713, 6.765483158146202], "isController": false}, {"data": ["Delete Msg on Custom", 100, 0, 0.0, 28.82999999999999, 15, 72, 26.5, 44.0, 54.799999999999955, 71.92999999999996, 8.14464896562958, 2.8633531519791497, 4.470012420589672], "isController": false}]}, function(index, item){
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
