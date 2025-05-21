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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9441176470588235, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.15, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [0.9, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 850, 0, 0.0, 202.75294117647076, 3, 5010, 23.0, 187.79999999999995, 1129.7499999999895, 4230.510000000001, 15.66531514928124, 32.76309594429598, 55.37922877119425], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 50, 0, 0.0, 36.059999999999995, 8, 134, 15.0, 90.8, 104.8999999999999, 134.0, 13.568521031207599, 12.561482360922659, 7.27452934192673], "isController": false}, {"data": ["Get User Data", 50, 0, 0.0, 34.18000000000001, 7, 101, 12.0, 92.69999999999999, 95.0, 101.0, 13.52447930754666, 49.25023667838788, 6.775447153097105], "isController": false}, {"data": ["Get Channels", 50, 0, 0.0, 12.42, 4, 49, 5.0, 36.8, 39.449999999999996, 49.0, 13.59064963305246, 10.94949799537918, 7.286393211470509], "isController": false}, {"data": ["Login", 50, 0, 0.0, 2664.9800000000005, 263, 5010, 2673.0, 4610.8, 4881.999999999999, 5010.0, 8.623663332183511, 12.37849393109693, 4.367077009313556], "isController": false}, {"data": ["Delete Msg on Main", 50, 0, 0.0, 25.359999999999996, 14, 57, 20.0, 45.39999999999999, 53.24999999999998, 57.0, 14.367816091954023, 5.051185344827586, 7.885461566091954], "isController": false}, {"data": ["Delete File on Main", 50, 0, 0.0, 29.960000000000004, 15, 85, 27.5, 47.9, 63.449999999999996, 85.0, 14.16029453412631, 4.978228547153781, 7.7715678986122905], "isController": false}, {"data": ["Upload Bee File", 50, 0, 0.0, 194.9, 8, 637, 61.5, 566.8, 609.8999999999999, 637.0, 14.355440712029859, 9.911422444731553, 707.9351941573356], "isController": false}, {"data": ["Get Bee Movie File", 50, 0, 0.0, 17.000000000000004, 8, 92, 10.5, 33.8, 43.94999999999995, 92.0, 13.709898546750754, 292.70097854400876, 7.229829311763093], "isController": false}, {"data": ["Get Stats on TownCentre", 50, 0, 0.0, 5.24, 3, 16, 5.0, 6.899999999999999, 11.699999999999974, 16.0, 13.694878115584771, 6.37935240345111, 7.342273520953164], "isController": false}, {"data": ["Post File", 50, 0, 0.0, 120.38, 57, 193, 133.5, 185.39999999999998, 188.89999999999998, 193.0, 13.94700139470014, 16.3169020223152, 12.176385983263598], "isController": false}, {"data": ["Update Msg to Main", 50, 0, 0.0, 44.86, 19, 131, 30.0, 92.69999999999999, 107.44999999999999, 131.0, 14.40922190201729, 11.426062680115272, 19.29203440201729], "isController": false}, {"data": ["Create New Channel", 50, 0, 0.0, 79.8, 45, 133, 76.0, 113.9, 120.44999999999999, 133.0, 14.048890137679123, 12.60833011379601, 14.090048995504354], "isController": false}, {"data": ["Delete Channel", 50, 0, 0.0, 26.679999999999993, 20, 39, 25.0, 36.0, 37.449999999999996, 39.0, 14.245014245014245, 5.008012820512821, 7.859797898860399], "isController": false}, {"data": ["Logout", 50, 0, 0.0, 14.940000000000003, 10, 29, 13.0, 25.799999999999997, 28.0, 29.0, 14.302059496567507, 5.7962448155034325, 7.5421016876430205], "isController": false}, {"data": ["Post Msg to Main", 50, 0, 0.0, 105.6, 29, 280, 47.0, 245.8, 254.45, 280.0, 13.631406761177754, 10.689472294165757, 11.581370978735006], "isController": false}, {"data": ["Post Msg to Custom Channel", 50, 0, 0.0, 19.76, 15, 40, 19.0, 24.0, 28.349999999999987, 40.0, 14.29388221841052, 11.208972091194967, 12.144216337907375], "isController": false}, {"data": ["Delete Msg on Custom", 50, 0, 0.0, 14.679999999999996, 12, 21, 14.0, 17.0, 19.449999999999996, 21.0, 14.30615164520744, 5.02950643776824, 7.851618383404864], "isController": false}]}, function(index, item){
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
