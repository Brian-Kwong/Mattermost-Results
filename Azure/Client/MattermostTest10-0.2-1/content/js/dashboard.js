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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9794117647058823, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.65, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 170, 0, 0.0, 69.71764705882349, 3, 1068, 27.0, 86.0, 368.5499999999989, 1011.9099999999994, 3.3614774682142645, 7.029095008700295, 11.883483250697012], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 10, 0, 0.0, 56.4, 15, 78, 63.5, 77.8, 78.0, 78.0, 98.0392156862745, 90.76286764705883, 52.56204044117647], "isController": false}, {"data": ["Get User Data", 10, 0, 0.0, 32.4, 21, 43, 33.5, 43.0, 43.0, 43.0, 217.3913043478261, 790.1664402173914, 108.90794836956522], "isController": false}, {"data": ["Get Channels", 10, 0, 0.0, 5.7, 4, 9, 5.5, 8.700000000000001, 9.0, 9.0, 322.5806451612903, 259.89163306451616, 172.9460685483871], "isController": false}, {"data": ["Login", 10, 0, 0.0, 658.0999999999999, 257, 1068, 658.5, 1060.1, 1068.0, 1068.0, 9.29368029739777, 13.345144052044608, 4.713093924256505], "isController": false}, {"data": ["Delete Msg on Main", 10, 0, 0.0, 28.099999999999998, 13, 42, 28.0, 41.6, 42.0, 42.0, 63.29113924050633, 22.250791139240505, 34.73595727848101], "isController": false}, {"data": ["Delete File on Main", 10, 0, 0.0, 16.599999999999998, 13, 22, 16.0, 21.700000000000003, 22.0, 22.0, 45.04504504504504, 15.83614864864865, 24.72198761261261], "isController": false}, {"data": ["Upload Bee File", 10, 0, 0.0, 39.0, 12, 72, 40.5, 71.3, 72.0, 72.0, 49.504950495049506, 34.1796875, 2441.3288985148515], "isController": false}, {"data": ["Get Bee Movie File", 10, 0, 0.0, 8.0, 5, 11, 8.0, 11.0, 11.0, 11.0, 112.35955056179775, 2398.8325140449438, 59.25210674157304], "isController": false}, {"data": ["Get Stats on TownCentre", 10, 0, 0.0, 4.8, 3, 10, 3.5, 9.9, 10.0, 10.0, 112.35955056179775, 52.33936095505618, 60.23964185393259], "isController": false}, {"data": ["Post File", 10, 0, 0.0, 94.5, 77, 109, 96.0, 108.9, 109.0, 109.0, 35.587188612099645, 41.63423042704626, 31.06928380782918], "isController": false}, {"data": ["Update Msg to Main", 10, 0, 0.0, 39.6, 23, 55, 40.5, 54.7, 55.0, 55.0, 69.44444444444444, 55.06727430555556, 92.97688802083334], "isController": false}, {"data": ["Create New Channel", 10, 0, 0.0, 65.8, 51, 83, 65.5, 82.4, 83.0, 83.0, 36.4963503649635, 32.75404881386861, 36.60327326642336], "isController": false}, {"data": ["Delete Channel", 10, 0, 0.0, 28.7, 24, 41, 25.5, 40.2, 41.0, 41.0, 42.016806722689076, 14.77153361344538, 23.183101365546218], "isController": false}, {"data": ["Logout", 10, 0, 0.0, 12.700000000000001, 11, 16, 12.0, 15.8, 16.0, 16.0, 46.082949308755765, 18.676195276497698, 24.30155529953917], "isController": false}, {"data": ["Post Msg to Main", 10, 0, 0.0, 50.00000000000001, 35, 68, 49.5, 67.3, 68.0, 68.0, 68.9655172413793, 54.08135775862069, 58.59375000000001], "isController": false}, {"data": ["Post Msg to Custom Channel", 10, 0, 0.0, 27.9, 17, 37, 29.0, 37.0, 37.0, 37.0, 43.47826086956522, 34.094769021739125, 36.93953804347826], "isController": false}, {"data": ["Delete Msg on Custom", 10, 0, 0.0, 16.9, 13, 24, 15.0, 24.0, 24.0, 24.0, 46.082949308755765, 16.20103686635945, 25.29161866359447], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 170, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
