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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.951764705882353, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.18, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 850, 0, 0.0, 144.49411764705908, 2, 4131, 11.0, 43.89999999999998, 948.0499999999953, 3548.2600000000007, 15.967538932616987, 32.95372392947044, 56.46289807309376], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 50, 0, 0.0, 4.7, 2, 10, 4.0, 7.899999999999999, 9.0, 10.0, 12.091898428053204, 5.644460399032648, 6.494672007255139], "isController": false}, {"data": ["Get User Data", 50, 0, 0.0, 7.859999999999998, 4, 21, 6.0, 15.899999999999999, 20.449999999999996, 21.0, 12.109469605231292, 44.15320749576169, 6.078386110438363], "isController": false}, {"data": ["Get Channels", 50, 0, 0.0, 3.62, 2, 8, 3.0, 5.0, 7.0, 8.0, 12.100677637947724, 9.74908110479187, 6.4993874031945795], "isController": false}, {"data": ["Login", 50, 0, 0.0, 2223.22, 183, 4131, 2225.5, 3815.2999999999997, 4017.5499999999997, 4131.0, 9.954210631096954, 14.28837503732829, 5.060316295042804], "isController": false}, {"data": ["Delete Msg on Main", 50, 0, 0.0, 10.740000000000004, 7, 30, 9.0, 16.9, 19.349999999999987, 30.0, 12.23091976516634, 4.2999327299412915, 6.724617019324853], "isController": false}, {"data": ["Delete File on Main", 50, 0, 0.0, 11.499999999999996, 7, 23, 10.0, 15.0, 22.449999999999996, 23.0, 12.281994595922379, 4.317888725128961, 6.752698200687792], "isController": false}, {"data": ["Upload Bee File", 50, 0, 0.0, 12.260000000000002, 5, 67, 7.0, 33.39999999999999, 57.09999999999992, 67.0, 12.242899118511263, 8.452861012487757, 603.7513964556807], "isController": false}, {"data": ["Get Bee Movie File", 50, 0, 0.0, 8.3, 4, 28, 6.0, 20.0, 26.0, 28.0, 12.100677637947724, 258.3447407429816, 6.3930337911423045], "isController": false}, {"data": ["Get Stats on TownCentre", 50, 0, 0.0, 3.2399999999999993, 2, 7, 3.0, 5.0, 6.449999999999996, 7.0, 12.097749818533753, 5.623563392209049, 6.497814843939027], "isController": false}, {"data": ["Post File", 50, 0, 0.0, 44.46, 28, 92, 37.0, 79.69999999999999, 87.79999999999998, 92.0, 12.195121951219512, 14.267339939024392, 10.658822408536587], "isController": false}, {"data": ["Update Msg to Main", 50, 0, 0.0, 15.8, 10, 42, 13.0, 28.799999999999997, 36.449999999999996, 42.0, 12.18917601170161, 9.487083282545099, 16.331591296928327], "isController": false}, {"data": ["Create New Channel", 50, 0, 0.0, 36.32, 29, 53, 34.0, 46.0, 48.89999999999999, 53.0, 12.221950623319481, 10.96872326448301, 12.269692617941823], "isController": false}, {"data": ["Delete Channel", 50, 0, 0.0, 16.1, 12, 24, 15.0, 19.9, 23.449999999999996, 24.0, 12.342631449024932, 4.339206368797828, 6.82219667983214], "isController": false}, {"data": ["Logout", 50, 0, 0.0, 8.119999999999997, 5, 17, 8.0, 9.899999999999999, 10.899999999999991, 17.0, 12.382367508667656, 5.018244644626052, 6.541856271669142], "isController": false}, {"data": ["Post Msg to Main", 50, 0, 0.0, 27.359999999999996, 16, 74, 21.0, 52.8, 67.24999999999997, 74.0, 12.07437816952427, 9.468482099734363, 10.270296275054335], "isController": false}, {"data": ["Post Msg to Custom Channel", 50, 0, 0.0, 12.959999999999999, 9, 19, 13.0, 15.899999999999999, 18.0, 19.0, 12.330456226880395, 9.669293310727497, 10.488112669543774], "isController": false}, {"data": ["Delete Msg on Custom", 50, 0, 0.0, 9.840000000000002, 7, 13, 10.0, 12.0, 12.449999999999996, 13.0, 12.351778656126482, 4.342422183794467, 6.79106580410079], "isController": false}]}, function(index, item){
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
