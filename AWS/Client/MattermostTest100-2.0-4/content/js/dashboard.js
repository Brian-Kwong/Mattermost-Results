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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9464705882352941, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Posts on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Data"], "isController": false}, {"data": [1.0, 500, 1500, "Get Channels"], "isController": false}, {"data": [0.09, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Delete File on Main"], "isController": false}, {"data": [1.0, 500, 1500, "Upload Bee File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Bee Movie File"], "isController": false}, {"data": [1.0, 500, 1500, "Get Stats on TownCentre"], "isController": false}, {"data": [1.0, 500, 1500, "Post File"], "isController": false}, {"data": [1.0, 500, 1500, "Update Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Create New Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Main"], "isController": false}, {"data": [1.0, 500, 1500, "Post Msg to Custom Channel"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Msg on Custom"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1700, 0, 0.0, 257.66941176470647, 2, 7995, 11.0, 46.0, 1504.3499999999867, 6710.220000000001, 29.256371865696043, 60.38926570809025, 103.44937464505138], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 100, 0, 0.0, 4.27, 2, 13, 4.0, 6.0, 7.949999999999989, 13.0, 11.143302874972143, 5.201658959215512, 5.98517244261199], "isController": false}, {"data": ["Get User Data", 100, 0, 0.0, 8.779999999999996, 4, 36, 7.0, 12.0, 21.94999999999999, 35.989999999999995, 11.128421989761852, 40.63971472985755, 5.585946194079679], "isController": false}, {"data": ["Get Channels", 100, 0, 0.0, 3.6899999999999986, 2, 10, 3.0, 6.0, 7.949999999999989, 9.989999999999995, 11.137097672346586, 8.972759355162045, 5.98183957010803], "isController": false}, {"data": ["Login", 100, 0, 0.0, 4132.49, 198, 7995, 4133.0, 7254.1, 7653.149999999999, 7994.23, 10.11326860841424, 14.518367434010923, 5.143150156755664], "isController": false}, {"data": ["Delete Msg on Main", 100, 0, 0.0, 11.619999999999997, 6, 31, 10.0, 21.0, 22.94999999999999, 30.97999999999999, 11.271415689810642, 3.9626070784490532, 6.197077181018936], "isController": false}, {"data": ["Delete File on Main", 100, 0, 0.0, 13.76, 7, 51, 12.0, 19.0, 26.899999999999977, 50.8099999999999, 11.291779584462512, 3.9697662601626016, 6.208273345754291], "isController": false}, {"data": ["Upload Bee File", 100, 0, 0.0, 8.67, 4, 58, 6.0, 17.200000000000045, 37.74999999999994, 57.91999999999996, 11.28286133363421, 7.790022424686901, 556.3777255161909], "isController": false}, {"data": ["Get Bee Movie File", 100, 0, 0.0, 5.749999999999997, 4, 33, 5.0, 7.0, 8.0, 32.77999999999989, 11.147029316687103, 237.9847216029428, 5.889202012038791], "isController": false}, {"data": ["Get Stats on TownCentre", 100, 0, 0.0, 3.17, 2, 12, 3.0, 4.0, 5.0, 11.949999999999974, 11.144544745347153, 5.180471971469965, 5.985839462832943], "isController": false}, {"data": ["Post File", 100, 0, 0.0, 51.81, 29, 154, 43.0, 107.60000000000008, 117.69999999999993, 153.96999999999997, 11.252391133115788, 13.164418532688195, 9.834853578260379], "isController": false}, {"data": ["Update Msg to Main", 100, 0, 0.0, 14.379999999999997, 9, 33, 13.0, 21.0, 24.0, 32.93999999999997, 11.257458065968704, 8.761908279860409, 15.083234830575257], "isController": false}, {"data": ["Create New Channel", 100, 0, 0.0, 48.23999999999999, 32, 137, 40.0, 79.00000000000006, 117.5499999999999, 136.96999999999997, 11.254924029262801, 10.100854670793472, 11.29888857625211], "isController": false}, {"data": ["Delete Channel", 100, 0, 0.0, 16.189999999999994, 12, 31, 16.0, 18.900000000000006, 19.94999999999999, 30.89999999999995, 11.313497001923295, 3.977401289738658, 6.253358694422445], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 7.710000000000001, 5, 22, 7.0, 9.0, 10.949999999999989, 21.889999999999944, 11.321181931393637, 4.588174317898789, 5.98121037586324], "isController": false}, {"data": ["Post Msg to Main", 100, 0, 0.0, 24.400000000000006, 11, 132, 16.0, 29.600000000000023, 109.84999999999997, 131.89999999999995, 11.129660545353365, 8.727653728436284, 9.466732749026155], "isController": false}, {"data": ["Post Msg to Custom Channel", 100, 0, 0.0, 14.7, 9, 34, 14.0, 20.0, 21.94999999999999, 33.929999999999964, 11.317338162064281, 8.874826703259393, 9.626368690583975], "isController": false}, {"data": ["Delete Msg on Custom", 100, 0, 0.0, 10.75, 7, 27, 10.0, 14.0, 15.0, 26.989999999999995, 11.319900384876613, 3.9796524790581844, 6.223734293638216], "isController": false}]}, function(index, item){
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
