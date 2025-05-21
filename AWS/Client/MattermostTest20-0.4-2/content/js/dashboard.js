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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9705882352941176, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 340, 0, 0.0, 76.28235294117653, 1, 1783, 13.0, 86.1000000000003, 417.699999999999, 1579.969999999998, 6.801904533269315, 14.0326205400012, 24.051187457488098], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 20, 0, 0.0, 11.299999999999999, 3, 24, 6.5, 24.0, 24.0, 24.0, 23.12138728323699, 10.792991329479769, 12.41871387283237], "isController": false}, {"data": ["Get User Data", 20, 0, 0.0, 9.199999999999998, 3, 17, 6.0, 16.900000000000002, 17.0, 17.0, 22.598870056497177, 82.11952683615819, 11.343573446327683], "isController": false}, {"data": ["Get Channels", 20, 0, 0.0, 7.55, 2, 15, 4.5, 14.0, 14.95, 15.0, 22.857142857142858, 18.415178571428573, 12.276785714285714], "isController": false}, {"data": ["Login", 20, 0, 0.0, 975.1500000000001, 173, 1783, 971.5, 1686.0000000000002, 1778.55, 1783.0, 11.204481792717086, 16.078540791316527, 5.694152661064426], "isController": false}, {"data": ["Delete Msg on Main", 20, 0, 0.0, 11.700000000000001, 8, 18, 11.0, 17.0, 17.95, 18.0, 24.752475247524753, 8.70204207920792, 13.60902691831683], "isController": false}, {"data": ["Delete File on Main", 20, 0, 0.0, 11.600000000000001, 8, 20, 11.0, 16.60000000000001, 19.849999999999998, 20.0, 25.380710659898476, 8.922906091370558, 13.954433692893401], "isController": false}, {"data": ["Upload Bee File", 20, 0, 0.0, 27.9, 5, 92, 14.0, 69.10000000000002, 90.89999999999998, 92.0, 24.875621890547265, 17.174867848258707, 1226.6645289179103], "isController": false}, {"data": ["Get Bee Movie File", 20, 0, 0.0, 8.3, 5, 17, 6.5, 16.50000000000001, 17.0, 17.0, 23.31002331002331, 497.6598921911422, 12.3151587995338], "isController": false}, {"data": ["Get Stats on TownCentre", 20, 0, 0.0, 3.0000000000000004, 1, 5, 3.0, 4.0, 4.949999999999999, 5.0, 23.337222870478413, 10.84816219369895, 12.534641190198366], "isController": false}, {"data": ["Post File", 20, 0, 0.0, 56.25, 30, 95, 48.0, 91.50000000000001, 94.85, 95.0, 24.271844660194173, 28.396162014563107, 21.214161104368934], "isController": false}, {"data": ["Update Msg to Main", 20, 0, 0.0, 18.799999999999997, 10, 35, 14.0, 31.900000000000002, 34.849999999999994, 35.0, 24.570024570024568, 19.123349201474202, 32.91999385749386], "isController": false}, {"data": ["Create New Channel", 20, 0, 0.0, 44.55, 28, 69, 43.0, 61.800000000000004, 68.64999999999999, 69.0, 24.783147459727388, 22.241906753407683, 24.879956629491943], "isController": false}, {"data": ["Delete Channel", 20, 0, 0.0, 16.8, 11, 30, 16.0, 19.900000000000002, 29.499999999999993, 30.0, 25.54278416347382, 8.979885057471265, 14.118374840357598], "isController": false}, {"data": ["Logout", 20, 0, 0.0, 7.75, 6, 10, 7.5, 9.0, 9.95, 10.0, 25.873221216041397, 10.485729301423026, 13.66934831824062], "isController": false}, {"data": ["Post Msg to Main", 20, 0, 0.0, 63.95000000000001, 16, 122, 61.5, 120.9, 121.95, 122.0, 23.12138728323699, 18.13132225433526, 19.666726878612717], "isController": false}, {"data": ["Post Msg to Custom Channel", 20, 0, 0.0, 13.349999999999994, 11, 18, 13.0, 16.0, 17.9, 18.0, 25.673940949935815, 20.13298299101412, 21.837893132220795], "isController": false}, {"data": ["Delete Msg on Custom", 20, 0, 0.0, 9.649999999999999, 8, 13, 9.5, 11.0, 12.899999999999999, 13.0, 25.673940949935815, 9.02599486521181, 14.115653080872914], "isController": false}]}, function(index, item){
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
