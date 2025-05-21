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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9558823529411765, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.25, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 850, 0, 0.0, 123.71882352941176, 2, 3442, 11.0, 71.69999999999993, 714.4499999999958, 2935.4000000000005, 16.155395902231344, 33.33782135577033, 57.12428458917779], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 50, 0, 0.0, 3.460000000000001, 2, 7, 3.0, 4.0, 6.449999999999996, 7.0, 14.392630972941854, 6.718435161197466, 7.73041702648244], "isController": false}, {"data": ["Get User Data", 50, 0, 0.0, 7.659999999999998, 4, 29, 5.0, 22.9, 25.89999999999999, 29.0, 14.355440712029859, 52.28801051536032, 7.205758326155613], "isController": false}, {"data": ["Get Channels", 50, 0, 0.0, 3.3, 2, 5, 3.0, 4.0, 5.0, 5.0, 14.392630972941854, 11.595625539723661, 7.73041702648244], "isController": false}, {"data": ["Login", 50, 0, 0.0, 1816.42, 138, 3442, 1814.0, 3165.4, 3335.2499999999995, 3442.0, 11.528706479133042, 16.548422368572748, 5.860726020290524], "isController": false}, {"data": ["Delete Msg on Main", 50, 0, 0.0, 10.620000000000001, 7, 26, 10.0, 14.0, 15.899999999999991, 26.0, 14.775413711583925, 5.194481382978724, 8.123591718380615], "isController": false}, {"data": ["Delete File on Main", 50, 0, 0.0, 17.18, 8, 58, 11.0, 32.0, 44.19999999999993, 58.0, 14.727540500736376, 5.177650957290132, 8.097270802650957], "isController": false}, {"data": ["Upload Bee File", 50, 0, 0.0, 15.700000000000001, 5, 73, 7.0, 54.09999999999999, 62.79999999999998, 73.0, 14.797277300976619, 10.216479542764132, 729.6739743637171], "isController": false}, {"data": ["Get Bee Movie File", 50, 0, 0.0, 6.279999999999999, 4, 16, 6.0, 8.0, 11.699999999999974, 16.0, 14.384349827387801, 307.10024992807826, 7.599544195914845], "isController": false}, {"data": ["Get Stats on TownCentre", 50, 0, 0.0, 2.9799999999999995, 2, 4, 3.0, 4.0, 4.0, 4.0, 14.396775122372588, 6.692250935790383, 7.73264288799309], "isController": false}, {"data": ["Post File", 50, 0, 0.0, 65.59999999999998, 28, 213, 40.0, 137.5, 187.94999999999996, 213.0, 14.64986815118664, 17.139201215939057, 12.804328120421918], "isController": false}, {"data": ["Update Msg to Main", 50, 0, 0.0, 14.9, 11, 29, 13.5, 20.799999999999997, 24.799999999999983, 29.0, 14.749262536873156, 11.479650626843657, 19.761707227138643], "isController": false}, {"data": ["Create New Channel", 50, 0, 0.0, 47.66, 31, 90, 39.5, 78.69999999999999, 84.44999999999999, 90.0, 14.607069821793749, 13.109274576394975, 14.66412868828513], "isController": false}, {"data": ["Delete Channel", 50, 0, 0.0, 19.400000000000006, 14, 32, 18.0, 25.0, 27.89999999999999, 32.0, 14.684287812041116, 5.162444933920705, 8.116510646108663], "isController": false}, {"data": ["Logout", 50, 0, 0.0, 7.840000000000002, 6, 41, 7.0, 9.0, 12.449999999999996, 41.0, 14.749262536873156, 5.977484328908554, 7.792334992625369], "isController": false}, {"data": ["Post Msg to Main", 50, 0, 0.0, 36.199999999999996, 13, 137, 17.0, 113.9, 123.35, 137.0, 14.347202295552368, 11.250784612625539, 12.203528515064562], "isController": false}, {"data": ["Post Msg to Custom Channel", 50, 0, 0.0, 18.020000000000003, 12, 33, 16.0, 26.9, 28.89999999999999, 33.0, 14.718869590815425, 11.542238556078894, 12.51966348984398], "isController": false}, {"data": ["Delete Msg on Custom", 50, 0, 0.0, 10.000000000000002, 7, 19, 9.0, 15.799999999999997, 18.449999999999996, 19.0, 14.727540500736376, 5.177650957290132, 8.097270802650957], "isController": false}]}, function(index, item){
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
