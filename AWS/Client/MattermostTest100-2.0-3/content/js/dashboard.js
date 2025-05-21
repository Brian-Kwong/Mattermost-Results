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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9485294117647058, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.13, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.995, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1700, 0, 0.0, 223.52117647058816, 1, 6717, 13.0, 90.90000000000009, 1214.4999999999873, 5664.300000000001, 29.8093952199758, 61.528951416165455, 105.40498036086902], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 100, 0, 0.0, 3.3600000000000008, 1, 9, 3.0, 5.0, 6.0, 8.989999999999995, 12.913223140495868, 6.027852208161157, 6.935813210227273], "isController": false}, {"data": ["Get User Data", 100, 0, 0.0, 7.140000000000002, 3, 33, 5.0, 13.500000000000028, 27.94999999999999, 33.0, 12.883277505797475, 47.03478283625355, 6.466801404277248], "isController": false}, {"data": ["Get Channels", 100, 0, 0.0, 3.1799999999999993, 1, 6, 3.0, 5.0, 6.0, 6.0, 12.918227619170649, 10.407751743960729, 6.938501162640486], "isController": false}, {"data": ["Login", 100, 0, 0.0, 3450.7599999999998, 103, 6717, 3464.5, 6112.200000000001, 6444.849999999999, 6716.3099999999995, 11.613053071652539, 16.67142227238416, 5.905872575775171], "isController": false}, {"data": ["Delete Msg on Main", 100, 0, 0.0, 14.72, 7, 58, 12.0, 24.0, 34.94999999999999, 57.989999999999995, 13.059945148230378, 4.591386966174742, 7.180419060989943], "isController": false}, {"data": ["Delete File on Main", 100, 0, 0.0, 21.28000000000001, 7, 66, 18.0, 40.900000000000006, 47.89999999999998, 65.92999999999996, 12.748597654258031, 4.481928862825089, 7.00923874936257], "isController": false}, {"data": ["Upload Bee File", 100, 0, 0.0, 16.289999999999996, 4, 130, 7.0, 44.90000000000006, 79.0, 129.87999999999994, 13.058239749281798, 9.015796389396709, 643.9257761491251], "isController": false}, {"data": ["Get Bee Movie File", 100, 0, 0.0, 8.51, 4, 45, 6.0, 14.900000000000006, 21.899999999999977, 44.82999999999991, 12.921566093810569, 275.8703886161003, 6.826725836671405], "isController": false}, {"data": ["Get Stats on TownCentre", 100, 0, 0.0, 3.5300000000000002, 2, 25, 3.0, 4.0, 6.0, 25.0, 12.924906294429366, 6.0080619103011506, 6.9420883417345225], "isController": false}, {"data": ["Post File", 100, 0, 0.0, 93.72, 34, 960, 62.0, 159.00000000000006, 220.1499999999998, 952.9899999999964, 12.683916793505833, 14.839191717402333, 11.086040556823948], "isController": false}, {"data": ["Update Msg to Main", 100, 0, 0.0, 20.71, 8, 76, 16.0, 39.50000000000003, 54.799999999999955, 75.97999999999999, 13.061650992685475, 10.166148282392895, 17.500571447230932], "isController": false}, {"data": ["Create New Channel", 100, 0, 0.0, 65.91999999999999, 33, 156, 52.5, 116.80000000000001, 135.4999999999999, 155.95999999999998, 12.712941774726671, 11.409368643529113, 12.762601703534198], "isController": false}, {"data": ["Delete Channel", 100, 0, 0.0, 19.579999999999995, 13, 44, 18.0, 25.900000000000006, 28.0, 43.91999999999996, 12.73398701133325, 4.476792308671845, 7.038512351967401], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 7.27, 5, 18, 7.0, 9.0, 10.949999999999989, 17.969999999999985, 12.755102040816327, 5.169304049744898, 6.7387794961734695], "isController": false}, {"data": ["Post Msg to Main", 100, 0, 0.0, 33.93000000000001, 13, 140, 23.0, 101.5000000000002, 126.89999999999998, 139.99, 12.894906511927788, 10.111923758865249, 10.968226144422953], "isController": false}, {"data": ["Post Msg to Custom Channel", 100, 0, 0.0, 18.119999999999994, 10, 43, 16.0, 25.900000000000006, 29.0, 42.95999999999998, 12.738853503184714, 9.98955015923567, 10.835489649681529], "isController": false}, {"data": ["Delete Msg on Custom", 100, 0, 0.0, 11.840000000000005, 7, 72, 9.0, 17.0, 21.899999999999977, 71.75999999999988, 12.746972594008922, 4.481357552581262, 7.00834528362014], "isController": false}]}, function(index, item){
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
