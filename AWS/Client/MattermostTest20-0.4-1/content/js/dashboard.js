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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 340, 0, 0.0, 77.35, 2, 1808, 12.0, 101.50000000000017, 422.0499999999989, 1616.2999999999984, 6.796601699150425, 14.022461425537232, 24.03204647676162], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 20, 0, 0.0, 7.750000000000001, 2, 17, 6.0, 14.0, 16.849999999999998, 17.0, 21.57497303128371, 10.071129989212514, 11.58812028047465], "isController": false}, {"data": ["Get User Data", 20, 0, 0.0, 8.85, 4, 19, 5.5, 16.800000000000004, 18.9, 19.0, 21.367521367521366, 77.68679887820512, 10.725494123931623], "isController": false}, {"data": ["Get Channels", 20, 0, 0.0, 4.800000000000001, 3, 10, 4.0, 8.900000000000002, 9.95, 10.0, 21.528525296017225, 17.34475914962325, 11.5631727664155], "isController": false}, {"data": ["Login", 20, 0, 0.0, 994.2499999999999, 180, 1808, 992.5, 1717.9, 1803.8999999999999, 1808.0, 11.025358324145534, 15.821496864663725, 5.603121554575524], "isController": false}, {"data": ["Delete Msg on Main", 20, 0, 0.0, 12.850000000000001, 7, 23, 11.0, 21.50000000000001, 22.95, 23.0, 23.724792408066428, 8.340747330960854, 13.044002075919336], "isController": false}, {"data": ["Delete File on Main", 20, 0, 0.0, 11.800000000000002, 8, 18, 11.0, 16.0, 17.9, 18.0, 24.301336573511545, 8.543438639125153, 13.360988760631836], "isController": false}, {"data": ["Upload Bee File", 20, 0, 0.0, 23.55, 6, 65, 12.5, 64.50000000000001, 65.0, 65.0, 23.809523809523807, 16.438802083333336, 1174.0699404761906], "isController": false}, {"data": ["Get Bee Movie File", 20, 0, 0.0, 6.15, 4, 9, 6.0, 8.0, 8.95, 9.0, 21.73913043478261, 464.12194293478257, 11.485224184782608], "isController": false}, {"data": ["Get Stats on TownCentre", 20, 0, 0.0, 3.25, 2, 6, 3.0, 4.900000000000002, 5.949999999999999, 6.0, 21.715526601520086, 10.094326818675352, 11.663612920738327], "isController": false}, {"data": ["Post File", 20, 0, 0.0, 71.9, 29, 136, 64.5, 132.8, 135.9, 136.0, 23.31002331002331, 27.270906177156178, 20.3735067016317], "isController": false}, {"data": ["Update Msg to Main", 20, 0, 0.0, 16.5, 12, 28, 15.5, 19.900000000000002, 27.599999999999994, 28.0, 23.58490566037736, 18.356611143867926, 31.600088443396228], "isController": false}, {"data": ["Create New Channel", 20, 0, 0.0, 43.39999999999999, 31, 61, 39.5, 59.800000000000004, 60.95, 61.0, 23.612750885478157, 21.191521546635183, 23.70498819362456], "isController": false}, {"data": ["Delete Channel", 20, 0, 0.0, 17.5, 13, 25, 17.0, 20.900000000000002, 24.799999999999997, 25.0, 24.360535931790498, 8.564250913520098, 13.464905602923265], "isController": false}, {"data": ["Logout", 20, 0, 0.0, 7.900000000000002, 6, 12, 7.5, 10.0, 11.899999999999999, 12.0, 24.509803921568626, 9.933172487745098, 12.949027267156863], "isController": false}, {"data": ["Post Msg to Main", 20, 0, 0.0, 62.349999999999994, 14, 123, 51.0, 117.80000000000001, 122.75, 123.0, 21.528525296017225, 16.88223223896663, 18.311860871905274], "isController": false}, {"data": ["Post Msg to Custom Channel", 20, 0, 0.0, 12.850000000000001, 10, 18, 12.0, 16.900000000000002, 17.95, 18.0, 24.44987775061125, 19.173097493887532, 20.79672218826406], "isController": false}, {"data": ["Delete Msg on Custom", 20, 0, 0.0, 9.300000000000002, 7, 13, 9.0, 11.0, 12.899999999999999, 13.0, 24.479804161566708, 8.606181150550796, 13.459111077111384], "isController": false}]}, function(index, item){
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
