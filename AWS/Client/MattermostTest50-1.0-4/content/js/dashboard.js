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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 850, 0, 0.0, 122.58941176470594, 2, 3470, 11.0, 42.89999999999998, 719.9999999999959, 2962.3200000000006, 16.167072428484477, 33.360486486229455, 57.164234572333385], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 50, 0, 0.0, 3.9399999999999995, 2, 12, 3.0, 6.899999999999999, 8.899999999999991, 12.0, 14.3143429716576, 6.681890566847982, 7.688367807042657], "isController": false}, {"data": ["Get User Data", 50, 0, 0.0, 8.98, 3, 33, 5.0, 31.0, 32.449999999999996, 33.0, 14.269406392694064, 51.95318073986872, 7.162573130707763], "isController": false}, {"data": ["Get Channels", 50, 0, 0.0, 3.6600000000000006, 2, 7, 3.0, 5.899999999999999, 6.449999999999996, 7.0, 14.318442153493699, 11.535854274054984, 7.690569516036655], "isController": false}, {"data": ["Login", 50, 0, 0.0, 1837.5, 146, 3470, 1850.5, 3196.5, 3366.6, 3470.0, 11.45737855178735, 16.44603753723648, 5.824465799725023], "isController": false}, {"data": ["Delete Msg on Main", 50, 0, 0.0, 11.700000000000006, 8, 40, 10.0, 17.0, 20.449999999999996, 40.0, 14.318442153493699, 5.033827319587629, 7.872346613688431], "isController": false}, {"data": ["Delete File on Main", 50, 0, 0.0, 12.300000000000002, 7, 49, 11.0, 16.0, 20.799999999999983, 49.0, 14.367816091954023, 5.051185344827586, 7.899492636494253], "isController": false}, {"data": ["Upload Bee File", 50, 0, 0.0, 16.54, 5, 104, 7.0, 52.899999999999984, 81.24999999999997, 104.0, 14.322543683758235, 9.888709359782297, 706.244069571756], "isController": false}, {"data": ["Get Bee Movie File", 50, 0, 0.0, 6.48, 4, 18, 6.0, 10.899999999999999, 12.899999999999991, 18.0, 14.310246136233545, 305.51816506868914, 7.560393710646823], "isController": false}, {"data": ["Get Stats on TownCentre", 50, 0, 0.0, 2.9, 2, 4, 3.0, 4.0, 4.0, 4.0, 14.3143429716576, 6.653932865731464, 7.688367807042657], "isController": false}, {"data": ["Post File", 50, 0, 0.0, 55.51999999999999, 27, 168, 35.0, 121.5, 153.0, 168.0, 14.253135689851767, 16.6750552309008, 12.457574650798175], "isController": false}, {"data": ["Update Msg to Main", 50, 0, 0.0, 17.040000000000003, 11, 38, 14.0, 27.0, 34.449999999999996, 38.0, 14.29388221841052, 11.125218875071468, 19.151568753573468], "isController": false}, {"data": ["Create New Channel", 50, 0, 0.0, 36.279999999999994, 27, 60, 35.0, 41.9, 47.699999999999974, 60.0, 14.289797084881394, 12.824534688482423, 14.345616604744212], "isController": false}, {"data": ["Delete Channel", 50, 0, 0.0, 16.119999999999997, 13, 24, 16.0, 18.0, 20.0, 24.0, 14.355440712029859, 5.046834625322997, 7.934745549813379], "isController": false}, {"data": ["Logout", 50, 0, 0.0, 7.460000000000002, 5, 12, 7.0, 9.0, 9.449999999999996, 12.0, 14.400921658986174, 5.83631102390553, 7.608299431163594], "isController": false}, {"data": ["Post Msg to Main", 50, 0, 0.0, 24.36, 13, 64, 18.0, 57.0, 59.449999999999996, 64.0, 14.253135689851767, 11.177019491163056, 12.123516783067275], "isController": false}, {"data": ["Post Msg to Custom Channel", 50, 0, 0.0, 13.340000000000003, 10, 22, 13.0, 16.0, 17.449999999999996, 22.0, 14.392630972941854, 11.286408858664362, 12.242169509211283], "isController": false}, {"data": ["Delete Msg on Custom", 50, 0, 0.0, 9.899999999999999, 8, 13, 10.0, 12.0, 13.0, 13.0, 14.41753171856978, 5.068663494809688, 7.9268265210495965], "isController": false}]}, function(index, item){
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
