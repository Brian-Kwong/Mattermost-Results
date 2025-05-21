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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1700, 0, 0.0, 260.5223529411767, 2, 8100, 12.0, 47.90000000000009, 1535.149999999986, 6805.280000000001, 29.177536729369766, 60.23674634529898, 103.16692930025401], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Posts on TownCentre", 100, 0, 0.0, 5.21, 2, 44, 4.0, 8.800000000000011, 15.0, 43.75999999999988, 10.96130658774526, 5.192918995944317, 5.88742053052724], "isController": false}, {"data": ["Get User Data", 100, 0, 0.0, 8.540000000000006, 4, 28, 7.0, 13.0, 17.0, 27.969999999999985, 10.990218705352236, 40.123957646444666, 5.516574623585009], "isController": false}, {"data": ["Get Channels", 100, 0, 0.0, 4.190000000000002, 2, 23, 3.0, 7.0, 10.849999999999966, 22.929999999999964, 10.997470581766192, 8.86026682612999, 5.906844550753327], "isController": false}, {"data": ["Login", 100, 0, 0.0, 4167.900000000001, 199, 8100, 4124.5, 7357.700000000001, 7764.4, 8099.039999999999, 10.007004903432403, 14.365817791203842, 5.089109251476033], "isController": false}, {"data": ["Delete Msg on Main", 100, 0, 0.0, 14.300000000000004, 7, 90, 10.0, 20.0, 47.399999999999864, 89.69999999999985, 10.98780353807274, 3.862899681353697, 6.041145890561476], "isController": false}, {"data": ["Delete File on Main", 100, 0, 0.0, 13.579999999999998, 7, 66, 11.0, 22.700000000000017, 25.0, 65.84999999999992, 11.035091591260208, 3.879524387552417, 6.067145083866697], "isController": false}, {"data": ["Upload Bee File", 100, 0, 0.0, 9.010000000000003, 4, 62, 6.0, 15.800000000000011, 23.899999999999977, 61.969999999999985, 10.999890001099988, 7.5946506159938405, 542.4002791222089], "isController": false}, {"data": ["Get Bee Movie File", 100, 0, 0.0, 8.27, 4, 23, 6.0, 16.0, 18.94999999999999, 22.989999999999995, 10.946907498631637, 233.7121989600438, 5.783473590585659], "isController": false}, {"data": ["Get Stats on TownCentre", 100, 0, 0.0, 3.220000000000001, 2, 12, 3.0, 5.0, 6.949999999999989, 11.989999999999995, 10.957703265395573, 5.093619877273723, 5.885485152312076], "isController": false}, {"data": ["Post File", 100, 0, 0.0, 56.230000000000004, 28, 303, 41.5, 97.3000000000001, 169.24999999999983, 302.1499999999996, 10.97213078779899, 12.83653582400702, 9.589899467851655], "isController": false}, {"data": ["Update Msg to Main", 100, 0, 0.0, 18.040000000000003, 11, 53, 14.0, 31.80000000000001, 38.0, 52.909999999999954, 10.985389432055367, 8.55015173569153, 14.718705371855433], "isController": false}, {"data": ["Create New Channel", 100, 0, 0.0, 42.92000000000001, 27, 139, 37.0, 60.0, 88.49999999999989, 138.89999999999995, 11.00715465052284, 9.878491331865712, 11.050151348376444], "isController": false}, {"data": ["Delete Channel", 100, 0, 0.0, 16.409999999999997, 12, 29, 16.0, 19.900000000000006, 21.94999999999999, 28.949999999999974, 11.061946902654867, 3.8889657079646023, 6.114318307522124], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 7.600000000000001, 5, 24, 7.0, 9.0, 10.0, 23.89999999999995, 11.072970878086592, 4.487580971099546, 5.850075434614107], "isController": false}, {"data": ["Post Msg to Main", 100, 0, 0.0, 28.470000000000002, 14, 91, 23.0, 48.90000000000006, 68.94999999999999, 90.84999999999992, 10.933741526350317, 8.574018013339163, 9.300086786573365], "isController": false}, {"data": ["Post Msg to Custom Channel", 100, 0, 0.0, 14.170000000000002, 10, 28, 14.0, 17.900000000000006, 19.0, 27.93999999999997, 11.061946902654867, 8.674554065265488, 9.409136476769913], "isController": false}, {"data": ["Delete Msg on Custom", 100, 0, 0.0, 10.819999999999995, 7, 26, 10.0, 14.0, 16.899999999999977, 26.0, 11.071744906997344, 3.8924103188662533, 6.0872972486713905], "isController": false}]}, function(index, item){
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
