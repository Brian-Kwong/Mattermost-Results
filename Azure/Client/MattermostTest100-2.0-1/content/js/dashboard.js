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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9291176470588235, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.91, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [0.995, 500, 1500, "Get User Data"], "isController": false}, {"data": [0.99, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.06, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [0.995, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.985, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [0.92, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [0.94, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1700, 0, 0.0, 385.8911764705877, 3, 12092, 28.0, 412.40000000000055, 2023.699999999999, 8619.09, 27.3756421198409, 57.39936809570203, 96.77006423211324], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 100, 0, 0.0, 202.85999999999996, 34, 1035, 52.5, 610.9, 914.3499999999999, 1034.83, 9.406452826639073, 9.548835657511052, 5.043108009594582], "isController": false}, {"data": ["Get User Data", 100, 0, 0.0, 36.330000000000005, 8, 530, 15.0, 77.60000000000002, 160.2999999999994, 527.0399999999985, 9.402914903620122, 34.24506714268924, 4.710639985895628], "isController": false}, {"data": ["Get Channels", 100, 0, 0.0, 25.959999999999997, 3, 559, 8.0, 35.0, 74.89999999999998, 558.8, 9.41885655081473, 7.588434232834134, 5.049758053122351], "isController": false}, {"data": ["Login", 100, 0, 0.0, 5348.0999999999985, 237, 12092, 5198.5, 9284.2, 10677.649999999998, 12081.099999999995, 7.73874013310633, 11.109550935420213, 3.9204578432131245], "isController": false}, {"data": ["Delete Msg on Main", 100, 0, 0.0, 37.120000000000005, 12, 158, 28.0, 78.9, 92.89999999999998, 157.57999999999979, 9.785693316371466, 3.4402828065368434, 5.370663714649183], "isController": false}, {"data": ["Delete File on Main", 100, 0, 0.0, 77.58999999999997, 11, 585, 59.5, 155.70000000000002, 213.4999999999999, 581.9499999999985, 9.207255317189945, 3.23692569744959, 5.053200672129638], "isController": false}, {"data": ["Upload Bee File", 100, 0, 0.0, 99.63, 7, 647, 36.0, 327.50000000000034, 458.19999999999936, 645.6199999999993, 9.222539887485013, 6.367515332472563, 454.7659636401365], "isController": false}, {"data": ["Get Bee Movie File", 100, 0, 0.0, 12.809999999999995, 7, 37, 11.0, 19.0, 21.0, 36.949999999999974, 9.894132779261898, 211.23586994162463, 5.217609082813892], "isController": false}, {"data": ["Get Stats on TownCentre", 100, 0, 0.0, 8.169999999999995, 3, 35, 6.0, 15.0, 22.94999999999999, 34.97999999999999, 9.896091044037604, 4.609800222662049, 5.3056191241959425], "isController": false}, {"data": ["Post File", 100, 0, 0.0, 285.9900000000001, 44, 936, 215.5, 632.3000000000001, 832.6999999999995, 935.91, 9.182736455463727, 10.743084251606978, 8.016959366391184], "isController": false}, {"data": ["Update Msg to Main", 100, 0, 0.0, 40.68999999999997, 18, 98, 36.5, 75.0, 85.94999999999999, 97.95999999999998, 9.850275807722616, 7.810960894405044, 13.188211066784872], "isController": false}, {"data": ["Create New Channel", 100, 0, 0.0, 238.8600000000001, 43, 1293, 98.0, 590.9000000000001, 911.8999999999977, 1290.4299999999987, 9.161704076958314, 8.222271530004582, 9.188545006871278], "isController": false}, {"data": ["Delete Channel", 100, 0, 0.0, 32.6, 20, 214, 27.0, 38.900000000000006, 45.0, 213.52999999999975, 9.366804046459348, 3.2930170475833647, 5.168207310790558], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 13.639999999999999, 9, 31, 13.0, 19.0, 20.94999999999999, 30.95999999999998, 9.373828271466067, 3.7989636061117364, 4.943229752530934], "isController": false}, {"data": ["Post Msg to Main", 100, 0, 0.0, 50.13999999999999, 23, 163, 43.5, 84.70000000000002, 110.5499999999999, 162.53999999999976, 9.867771857114663, 7.7381062512334715, 8.383751480165778], "isController": false}, {"data": ["Post Msg to Custom Channel", 100, 0, 0.0, 31.06000000000001, 16, 232, 24.0, 41.80000000000001, 75.39999999999986, 231.50999999999976, 9.35278713056491, 7.334265689300412, 7.946215628507295], "isController": false}, {"data": ["Delete Msg on Custom", 100, 0, 0.0, 18.59999999999999, 11, 108, 16.0, 24.0, 30.849999999999966, 107.74999999999987, 9.37207122774133, 3.294868791002812, 5.143656279287723], "isController": false}]}, function(index, item){
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
