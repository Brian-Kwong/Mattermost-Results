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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9529411764705882, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.2, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 850, 0, 0.0, 154.8094117647056, 2, 3862, 19.0, 176.89999999999998, 960.2999999999909, 3267.830000000001, 16.044395786930423, 33.55227125528521, 56.71631237258862], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 50, 0, 0.0, 15.460000000000004, 7, 38, 8.0, 33.0, 37.0, 38.0, 19.305019305019304, 17.872224903474905, 10.350054295366796], "isController": false}, {"data": ["Get User Data", 50, 0, 0.0, 38.44, 6, 120, 8.0, 108.0, 115.24999999999997, 120.0, 18.9897455374098, 69.07890832700342, 9.513417442081277], "isController": false}, {"data": ["Get Channels", 50, 0, 0.0, 5.56, 3, 14, 4.0, 10.0, 11.449999999999996, 14.0, 19.28268414963363, 15.535365647898187, 10.338079685692248], "isController": false}, {"data": ["Login", 50, 0, 0.0, 2073.66, 237, 3862, 2032.5, 3525.5, 3722.6499999999996, 3862.0, 10.642826734780758, 15.276821586313323, 5.389593976160068], "isController": false}, {"data": ["Delete Msg on Main", 50, 0, 0.0, 17.259999999999998, 12, 35, 15.0, 24.9, 28.449999999999996, 35.0, 19.554165037152913, 6.874511145874071, 10.73187573328119], "isController": false}, {"data": ["Delete File on Main", 50, 0, 0.0, 19.339999999999996, 11, 61, 16.0, 37.29999999999999, 47.14999999999997, 61.0, 19.70831690973591, 6.92870516357903, 10.816478616476154], "isController": false}, {"data": ["Upload Bee File", 50, 0, 0.0, 65.39999999999999, 7, 259, 19.5, 194.39999999999998, 232.45, 259.0, 19.60015680125441, 13.532530135241082, 966.5143571148568], "isController": false}, {"data": ["Get Bee Movie File", 50, 0, 0.0, 7.939999999999998, 5, 15, 7.0, 11.899999999999999, 13.449999999999996, 15.0, 19.39487975174554, 414.07310657486425, 10.227768619084562], "isController": false}, {"data": ["Get Stats on TownCentre", 50, 0, 0.0, 4.0200000000000005, 2, 8, 4.0, 6.0, 7.0, 8.0, 19.387359441644048, 9.031025833656456, 10.394199544397052], "isController": false}, {"data": ["Post File", 50, 0, 0.0, 115.29999999999998, 40, 266, 92.5, 206.8, 235.24999999999997, 266.0, 19.45525291828794, 22.76112597276265, 16.985347762645915], "isController": false}, {"data": ["Update Msg to Main", 50, 0, 0.0, 32.7, 18, 101, 24.0, 67.0, 75.35, 101.0, 19.49317738791423, 15.457480506822613, 26.098775584795323], "isController": false}, {"data": ["Create New Channel", 50, 0, 0.0, 63.19999999999999, 42, 112, 57.5, 89.5, 98.79999999999998, 112.0, 19.538882375928097, 17.535383694802658, 19.596125195388822], "isController": false}, {"data": ["Delete Channel", 50, 0, 0.0, 25.860000000000003, 20, 36, 25.0, 33.0, 34.449999999999996, 36.0, 19.73164956590371, 6.936908050513024, 10.887091801499606], "isController": false}, {"data": ["Logout", 50, 0, 0.0, 12.68, 10, 19, 12.0, 17.9, 18.0, 19.0, 19.864918553833927, 8.050723827969806, 10.475640643623361], "isController": false}, {"data": ["Post Msg to Main", 50, 0, 0.0, 96.80000000000003, 20, 259, 36.5, 237.8, 247.49999999999994, 259.0, 19.305019305019304, 15.138604005791507, 16.401725386100388], "isController": false}, {"data": ["Post Msg to Custom Channel", 50, 0, 0.0, 22.16, 15, 48, 19.5, 36.39999999999999, 41.599999999999966, 48.0, 19.75503753457132, 15.491499160410903, 16.784065092848675], "isController": false}, {"data": ["Delete Msg on Custom", 50, 0, 0.0, 15.979999999999997, 12, 39, 15.0, 21.0, 24.449999999999996, 39.0, 19.80982567353407, 6.964391838351823, 10.872189480982568], "isController": false}]}, function(index, item){
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
