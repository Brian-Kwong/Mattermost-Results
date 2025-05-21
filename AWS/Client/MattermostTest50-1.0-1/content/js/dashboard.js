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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 850, 0, 0.0, 121.83647058823534, 2, 3442, 11.0, 59.89999999999998, 701.7999999999956, 2936.3600000000006, 16.176918392204627, 33.37903783614685, 57.20321153461861], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 50, 0, 0.0, 4.639999999999999, 2, 8, 5.0, 6.0, 6.449999999999996, 8.0, 14.367816091954023, 6.706851652298851, 7.717088721264368], "isController": false}, {"data": ["Get User Data", 50, 0, 0.0, 7.439999999999998, 4, 26, 5.0, 20.0, 26.0, 26.0, 14.351320321469576, 52.22479100889782, 7.203690083237658], "isController": false}, {"data": ["Get Channels", 50, 0, 0.0, 3.4200000000000004, 2, 5, 3.0, 4.0, 5.0, 5.0, 14.37607820586544, 11.582289570155261, 7.721526380103508], "isController": false}, {"data": ["Login", 50, 0, 0.0, 1812.72, 127, 3442, 1809.0, 3173.9, 3336.6499999999996, 3442.0, 11.52604887044721, 16.544607610073765, 5.859375], "isController": false}, {"data": ["Delete Msg on Main", 50, 0, 0.0, 10.679999999999998, 7, 23, 10.0, 12.899999999999999, 14.349999999999987, 23.0, 14.628437682855472, 5.142810122878877, 8.042783608835576], "isController": false}, {"data": ["Delete File on Main", 50, 0, 0.0, 12.2, 8, 30, 11.0, 18.0, 23.89999999999999, 30.0, 14.6756677428823, 5.159414440857059, 8.068750917229234], "isController": false}, {"data": ["Upload Bee File", 50, 0, 0.0, 19.7, 5, 106, 8.0, 72.8, 97.49999999999996, 106.0, 14.645577035735208, 10.111741176039835, 722.2369059387814], "isController": false}, {"data": ["Get Bee Movie File", 50, 0, 0.0, 6.759999999999999, 3, 53, 5.0, 7.0, 19.24999999999998, 53.0, 14.37607820586544, 306.92365403967796, 7.595174130247268], "isController": false}, {"data": ["Get Stats on TownCentre", 50, 0, 0.0, 3.0200000000000005, 2, 5, 3.0, 4.0, 4.0, 5.0, 14.380212827149842, 6.684552056370435, 7.723747123957435], "isController": false}, {"data": ["Post File", 50, 0, 0.0, 49.099999999999994, 29, 152, 37.5, 93.69999999999999, 99.44999999999999, 152.0, 14.547570555717195, 17.019521021239452, 12.714917624381728], "isController": false}, {"data": ["Update Msg to Main", 50, 0, 0.0, 14.719999999999997, 11, 21, 14.0, 18.9, 20.449999999999996, 21.0, 14.619883040935672, 11.378951937134504, 19.588358918128655], "isController": false}, {"data": ["Create New Channel", 50, 0, 0.0, 41.93999999999998, 28, 84, 33.0, 74.69999999999999, 77.0, 84.0, 14.568764568764568, 13.074897108100233, 14.625673805361306], "isController": false}, {"data": ["Delete Channel", 50, 0, 0.0, 16.180000000000003, 12, 33, 16.0, 19.0, 22.349999999999987, 33.0, 14.66275659824047, 5.154875366568914, 8.10460960410557], "isController": false}, {"data": ["Logout", 50, 0, 0.0, 7.819999999999999, 5, 10, 8.0, 9.0, 10.0, 10.0, 14.70155836518671, 5.958151095266099, 7.7671319097324325], "isController": false}, {"data": ["Post Msg to Main", 50, 0, 0.0, 37.58000000000001, 13, 130, 19.0, 114.69999999999999, 125.35, 130.0, 14.326647564469916, 11.234666010028652, 12.186044949856733], "isController": false}, {"data": ["Post Msg to Custom Channel", 50, 0, 0.0, 13.599999999999998, 10, 21, 13.0, 17.9, 20.449999999999996, 21.0, 14.679976512037582, 11.511739393716969, 12.486581583969466], "isController": false}, {"data": ["Delete Msg on Custom", 50, 0, 0.0, 9.7, 7, 15, 10.0, 11.0, 13.449999999999996, 15.0, 14.692918013517485, 5.165478989127241, 8.078235196885101], "isController": false}]}, function(index, item){
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
