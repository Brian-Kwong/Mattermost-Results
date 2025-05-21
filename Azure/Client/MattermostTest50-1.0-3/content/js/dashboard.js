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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9523529411764706, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.19, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 850, 0, 0.0, 159.3564705882356, 2, 4010, 21.0, 126.0, 863.7499999999949, 3426.2400000000007, 15.966639116387407, 33.387830984906834, 56.438583911732664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 50, 0, 0.0, 28.559999999999995, 7, 119, 8.0, 101.1, 110.19999999999993, 119.0, 17.87629603146228, 16.549539685377187, 9.58406886843046], "isController": false}, {"data": ["Get User Data", 50, 0, 0.0, 36.58, 6, 109, 7.0, 100.9, 105.44999999999999, 109.0, 17.75568181818182, 64.55508145419034, 8.895180442116478], "isController": false}, {"data": ["Get Channels", 50, 0, 0.0, 10.66, 2, 43, 4.0, 32.8, 38.89999999999999, 43.0, 17.86352268667381, 14.391998258306538, 9.577220659163988], "isController": false}, {"data": ["Login", 50, 0, 0.0, 2148.82, 223, 4010, 2157.0, 3701.1, 3885.7999999999997, 4010.0, 10.32844453625284, 14.825554185602147, 5.230388865936789], "isController": false}, {"data": ["Delete Msg on Main", 50, 0, 0.0, 17.339999999999996, 12, 33, 15.0, 25.9, 29.349999999999987, 33.0, 17.946877243359655, 6.309449030868628, 9.849750987078249], "isController": false}, {"data": ["Delete File on Main", 50, 0, 0.0, 20.820000000000004, 12, 56, 16.5, 37.699999999999996, 45.79999999999998, 56.0, 18.23486506199854, 6.410694748358862, 10.007806801604668], "isController": false}, {"data": ["Upload Bee File", 50, 0, 0.0, 84.74000000000001, 7, 283, 17.0, 249.39999999999998, 265.0999999999999, 283.0, 17.998560115190784, 12.426740235781137, 887.4822826673866], "isController": false}, {"data": ["Get Bee Movie File", 50, 0, 0.0, 7.400000000000002, 5, 15, 7.0, 10.0, 12.449999999999996, 15.0, 17.985611510791365, 383.9857801258993, 9.484599820143886], "isController": false}, {"data": ["Get Stats on TownCentre", 50, 0, 0.0, 4.140000000000001, 3, 7, 4.0, 5.0, 7.0, 7.0, 17.998560115190784, 8.384094897408207, 9.64961865550756], "isController": false}, {"data": ["Post File", 50, 0, 0.0, 105.16, 40, 250, 74.5, 228.7, 235.0, 250.0, 17.857142857142858, 20.89146205357143, 15.590122767857144], "isController": false}, {"data": ["Update Msg to Main", 50, 0, 0.0, 34.739999999999995, 18, 100, 29.0, 55.9, 63.34999999999999, 100.0, 17.889087656529515, 14.18548747763864, 23.95111247763864], "isController": false}, {"data": ["Create New Channel", 50, 0, 0.0, 60.97999999999998, 41, 107, 55.0, 93.29999999999998, 103.0, 107.0, 18.070112034694613, 16.21721968738706, 18.12305181604626], "isController": false}, {"data": ["Delete Channel", 50, 0, 0.0, 35.6, 22, 89, 28.5, 68.6, 82.89999999999999, 89.0, 18.368846436443793, 6.45779757531227, 10.135154527920646], "isController": false}, {"data": ["Logout", 50, 0, 0.0, 15.820000000000006, 11, 36, 14.0, 22.9, 28.799999999999983, 36.0, 18.34189288334556, 7.433481979090242, 9.67248257520176], "isController": false}, {"data": ["Post Msg to Main", 50, 0, 0.0, 47.65999999999999, 19, 126, 29.0, 104.89999999999998, 122.14999999999998, 126.0, 17.921146953405017, 14.053399417562725, 15.225974462365592], "isController": false}, {"data": ["Post Msg to Custom Channel", 50, 0, 0.0, 31.920000000000016, 16, 119, 20.0, 87.89999999999998, 118.44999999999999, 119.0, 18.368846436443793, 14.404476258265982, 15.606344140337987], "isController": false}, {"data": ["Delete Msg on Custom", 50, 0, 0.0, 18.119999999999997, 12, 35, 16.0, 32.699999999999996, 33.449999999999996, 35.0, 18.422991893883566, 6.476833087693442, 10.111056098010318], "isController": false}]}, function(index, item){
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
