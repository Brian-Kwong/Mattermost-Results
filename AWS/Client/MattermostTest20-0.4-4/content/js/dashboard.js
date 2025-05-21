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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9676470588235294, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.45, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 340, 0, 0.0, 84.70294117647053, 2, 1984, 12.0, 98.80000000000007, 465.44999999999897, 1766.2799999999977, 6.775337770515325, 13.978590586515084, 23.95818283946435], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 20, 0, 0.0, 8.2, 3, 22, 5.0, 18.800000000000004, 21.849999999999998, 22.0, 18.761726078799253, 8.757915103189493, 10.077098968105066], "isController": false}, {"data": ["Get User Data", 20, 0, 0.0, 9.399999999999999, 4, 20, 6.0, 19.800000000000004, 20.0, 20.0, 18.656716417910445, 67.83101096082089, 9.364797108208954], "isController": false}, {"data": ["Get Channels", 20, 0, 0.0, 5.8, 3, 12, 4.0, 11.0, 11.95, 12.0, 18.779342723004696, 15.129841549295776, 10.08656103286385], "isController": false}, {"data": ["Login", 20, 0, 0.0, 1092.35, 197, 1984, 1091.5, 1885.0000000000002, 1979.5, 1984.0, 10.080645161290322, 14.465824250252016, 5.123015372983871], "isController": false}, {"data": ["Delete Msg on Main", 20, 0, 0.0, 15.299999999999995, 9, 27, 11.0, 25.900000000000002, 26.95, 27.0, 22.197558268590456, 7.803829078801332, 12.204321587125415], "isController": false}, {"data": ["Delete File on Main", 20, 0, 0.0, 10.450000000000003, 7, 15, 10.0, 13.900000000000002, 14.95, 15.0, 22.753128555176335, 7.999146757679181, 12.509776734926053], "isController": false}, {"data": ["Upload Bee File", 20, 0, 0.0, 34.199999999999996, 5, 113, 17.0, 104.40000000000003, 112.64999999999999, 113.0, 22.3463687150838, 15.428596368715084, 1101.9945879888269], "isController": false}, {"data": ["Get Bee Movie File", 20, 0, 0.0, 6.050000000000001, 4, 10, 6.0, 7.900000000000002, 9.899999999999999, 10.0, 18.850141376060318, 402.44315504241285, 9.958912582469369], "isController": false}, {"data": ["Get Stats on TownCentre", 20, 0, 0.0, 2.95, 2, 4, 3.0, 4.0, 4.0, 4.0, 18.885741265344663, 8.77891879131256, 10.143708687440983], "isController": false}, {"data": ["Post File", 20, 0, 0.0, 56.85, 32, 115, 43.5, 106.20000000000002, 114.6, 115.0, 21.929824561403507, 25.656181469298243, 19.167180646929825], "isController": false}, {"data": ["Update Msg to Main", 20, 0, 0.0, 36.3, 12, 74, 21.5, 72.80000000000001, 73.95, 74.0, 21.436227224008576, 16.68425107181136, 28.721195069667736], "isController": false}, {"data": ["Create New Channel", 20, 0, 0.0, 38.45, 29, 53, 37.0, 45.0, 52.599999999999994, 53.0, 22.271714922048996, 19.987994153674833, 22.35871380846325], "isController": false}, {"data": ["Delete Channel", 20, 0, 0.0, 16.1, 11, 21, 16.0, 19.0, 20.9, 21.0, 23.12138728323699, 8.128612716763007, 12.779985549132949], "isController": false}, {"data": ["Logout", 20, 0, 0.0, 7.3, 5, 9, 7.5, 9.0, 9.0, 9.0, 23.36448598130841, 9.46900554906542, 12.34393253504673], "isController": false}, {"data": ["Post Msg to Main", 20, 0, 0.0, 77.10000000000002, 16, 159, 41.0, 151.5, 158.65, 159.0, 18.6219739292365, 14.602973696461824, 15.839589152700185], "isController": false}, {"data": ["Post Msg to Custom Channel", 20, 0, 0.0, 13.700000000000001, 10, 19, 14.0, 16.900000000000002, 18.9, 19.0, 23.014959723820485, 18.047863924050635, 19.57620109321059], "isController": false}, {"data": ["Delete Msg on Custom", 20, 0, 0.0, 9.45, 8, 13, 9.0, 11.0, 12.899999999999999, 13.0, 23.174971031286212, 8.14745075318656, 12.741707705677868], "isController": false}]}, function(index, item){
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
