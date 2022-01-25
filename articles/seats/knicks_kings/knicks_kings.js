let rowFilter, secFilter;

// https://www.d3-graph-gallery.com/graph/line_basic.html
function addRow(ticket, data, numDistinctValues, numChanges, metadataMap) {
    var margin = {
            top: 10,
            right: 30,
            bottom: 30,
            left: 60
        },
        width = 800 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;

    let tr = $('<tr>');
    $('#tab tbody').append(tr);

    {
        let td = $('<td>');
        $(tr).append(td);
        td.attr('id', ticket);
    }

    // https://stackoverflow.com/questions/14968615/rounding-to-the-nearest-hundredth-of-a-decimal-in-javascript
    function formatMoney(num) {
        try {
            let dollarUS = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            });
            return dollarUS.format(num);
        } catch (_) {}
        return '$' + Math.ceil(num * 100) / 100;
    }

    function formatMoneyWithSign(num) {
        let sign = '';
        if (num > 0) {
            sign = '+';
        }
        return sign + formatMoney(num);
    }

    function formatPercent(num) {
        return (Math.ceil(num * 100) / 100) + '%';
    }

    function formatPercentWithSign(num) {
        let sign = '';
        if (num > 0) {
            sign = '+';
        }
        return sign + formatPercent(num);
    }
    let min = d3.min(data, function (d) {
            return d.price;
        }),
        max = d3.max(data, function (d) {
            return d.price;
        }),
        start = data[0].price,
        end = data[data.length - 1].price,
        metadata = metadataMap[ticket],
        url = metadata.url,
        row = metadata.row,
        section = metadata.section,
        site = metadata.site;
    let diffClass = 'nochange';
    if (end < start) {
        diffClass = 'down';
    } else if (end > start) {
        diffClass = 'up';
    }


    const type = 'line';

    if (type == 'line') {
        var svg = d3.select("#" + ticket)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.date;
            }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([min - (max - min) / 10, max + (max - min) / 10])
            .rangeRound([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y).ticks(3));

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d",
                d3.line()
                .x(function (d) {
                    return x(d.date)
                })
                .y(function (d) {
                    return y(d.price)
                })
                .curve(d3.curveStepAfter)
            )
    }

    if (type == 'bar') {
        var svg = d3.select("#" + ticket)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // X axis
        let dates = data.map((d) => d.date);
        var x = d3.scaleBand()
            .range([0, width])
            .domain(dates);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(10))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([min - (max - min) / 10, max + (max - min) / 10])
            .rangeRound([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y).ticks(3));

        // Bars
        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.date);
            })
            .attr("y", function (d) {
                return y(d.price);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.price);
            })
            .attr("fill", "#69b3a2");
    }

    if (type == 'steppedArea') {
        var data = google.visualization.arrayToDataTable([
            ['Director (Year)', 'Rotten Tomatoes', 'IMDB'],
            ['Alfred Hitchcock (1935)', 8.4, 7.9],
            ['Ralph Thomas (1959)', 6.9, 6.5],
            ['Don Sharp (1978)', 6.5, 6.4],
            ['James Hawes (2008)', 4.4, 6.2]
        ]);

        var options = {
            title: 'The decline of \'The 39 Steps\'',
            vAxis: {
                title: 'Accumulated Rating'
            },
            isStacked: true
        };

        var chart = new google.visualization.SteppedAreaChart(document.getElementById(ticket));

        chart.draw(data, options);
    }

    $(tr).append($('<td>').addClass('logo-container').append(
        $('<a>').attr('target', '_').attr('href', url).append($('<img>').addClass('site-background').attr('src', images[site]))));

    {
        let td = $('<td>').append(section).addClass('section-col');
        if (!secFilter) {
            td
                .append('<br/>')
                .append(
                    $('<button>')
                    .attr('type', 'button')
                    .addClass('btn')
                    .addClass('badge-info')
                    .addClass('badge')
                    .text('filter')
                    .click(function (section, e) {
                        secFilter = section;
                        reload();
                    }.bind(null, section))
                );
        }
        $(tr).append(td);
    }

    {
        let td = $('<td>').append(row).addClass('row-col');
        if (!rowFilter) {
            td
                .append('<br/>')
                .append(
                    $('<button>')
                    .attr('type', 'button')
                    .addClass('btn')
                    .addClass('badge-info')
                    .addClass('badge')
                    .text('filter')
                    .click(function (row, e) {
                        rowFilter = row;
                        reload();
                    }.bind(null, row))
                );
        }
        $(tr).append(td);
    }

    $(tr).append($('<td>').addClass('currency').html(formatMoney(min)).attr('data-value', min));
    $(tr).append($('<td>').addClass('currency').html(formatMoney(max)).attr('data-value', max));
    $(tr).append($('<td>').addClass('currency').html(formatMoney(max - min)).attr('data-value', max - min));
    $(tr).append($('<td>').addClass('currency').html(formatPercent(100 * (max - min) / max)).attr('data-value', 100 * (max - min) / max));
    $(tr).append($('<td>').addClass('currency').html(formatMoney(start)).attr('data-value', start));
    $(tr).append($('<td>').addClass('currency').html(formatMoney(end)).attr('data-value', end));
    $(tr).append($('<td>').addClass('currency').html(formatMoneyWithSign(end - start)).addClass(diffClass).attr('data-value', end - start));
    $(tr).append($('<td>').addClass('currency').html(formatPercentWithSign(100 * (end - start) / start)).addClass(diffClass).attr('data-value', 100 * (end - start) / start));
    $(tr).append($('<td>').addClass('number').text(numDistinctValues).attr('data-value', numDistinctValues));
    $(tr).append($('<td>').addClass('number').text(numChanges).attr('data-value', numChanges));
}

function row(d) {
    return {
        time: new Date(Date.parse(d.date)),
        date: new Date(Date.parse(d.date)),
        price: +d.price,
        ticket: d.ticket,
        row: d.row,
        section: d.section,
        site: d.site,
        url: d.url,
    };
}

function isTesting() {
    return document.location.host.match(/localhost/);
}


function load() {
    $('.loading').show();
    $('#tab').hide();

    let params = new URLSearchParams(document.location.search);
    rowFilter = params.get('row') || null;
    secFilter = params.get('section') || null;
    lastMinuteFilter = params.get('lastMinute') || false;

    if (rowFilter || secFilter || lastMinuteFilter) {
        let filtersContainer = $('.filter .filters')
        if (rowFilter) {
            filtersContainer
                .append(' ')
                .append(
                    $('<button>')
                    .attr('type', 'button')
                    .addClass('btn')
                    .addClass('badge-info')
                    .addClass('badge')
                    .text('Row: ' + rowFilter)
                    .click(function (e) {
                        rowFilter = null;
                        reload();
                    })
                );
        }
        if (secFilter) {
            filtersContainer
                .append(' ')
                .append(
                    $('<button>')
                    .attr('type', 'button')
                    .addClass('btn')
                    .addClass('badge-info')
                    .addClass('badge')
                    .text('Section: ' + secFilter)
                    .click(function (e) {
                        secFilter = null;
                        reload();
                    })
                );
        }
        if (lastMinuteFilter) {
            filtersContainer
                .append(' ')
                .append(
                    $('<button>')
                    .attr('type', 'button')
                    .addClass('btn')
                    .addClass('badge-info')
                    .addClass('badge')
                    .text('Last minute changes')
                    .click(function (e) {
                        lastMinuteFilter = false;
                        reload();
                    })
                );
        }
        $('.filter').show();
    }

    console.log('loading metadata...');
    // Map tickets to metadata objects.
    let metadataMap = {};
    let file = 'knicks_kings_metadata.csv';
    if (isTesting()) {
        file += '?fake=' + (new Date()).getTime();
    }
    d3.csv(file, row, function (error, data) {
        if (error) throw error;
        data.forEach((d) => {
            metadataMap[d.ticket] = d;
        });
        loadData(metadataMap);
    });
}

function loadData(metadataMap) {
    console.log('loading data...');
    let file = 'knicks_kings.csv';
    if (isTesting()) {
        file += '?fake=' + (new Date()).getTime();
    }
    d3.csv(file, row, function (error, dataAll) {
        if (error) throw error;

        let distinctValues = (values) => {
            let set = {};
            values.forEach((v) => {
                set[v.price] = true;
            });
            return Object.keys(set).length;
        };

        let changes = (values) => {
            let changes = 0;
            values.forEach((v, i) => {
                if (i > 0) {
                    if (v.price != values[i - 1].price) {
                        changes++;
                    }
                }
            });
            return changes;
        };

        let numChangesMap = {};
        let dataMap = {};
        if (lastMinuteFilter) {
            dataAll.forEach((d) => {
                let key = d.ticket;
                let values = dataMap[key] || [];
                values.push(d);
                dataMap[key] = values;
            });
            for (let ticket in dataMap) {
                numChangesMap[ticket] = changes(dataMap[ticket]);
            }
        }

        if (rowFilter || secFilter || lastMinuteFilter) {
            dataAll = dataAll.filter((d) => {
                if (rowFilter && metadataMap[d.ticket].row != rowFilter) {
                    return false;
                }
                if (secFilter && metadataMap[d.ticket].section != secFilter) {
                    return false;
                }
                if (lastMinuteFilter) {
                    if (numChangesMap[d.ticket] != 1) {
                        return false;
                    }
                    let lastMinute = new Date(1643061609236); // 5pm
                    if (d.time < lastMinute) {
                        return false;
                    }
                }
                return true;
            });
        }

        // Find the keys.
        dataMap = {};
        dataAll.forEach((d) => {
            let key = d.ticket;
            let values = dataMap[key] || [];
            values.push(d);
            dataMap[key] = values;
        });

        let data = [];
        for (let ticket in dataMap) {
            let values = dataMap[ticket],
                numDistinctValues = distinctValues(values),
                numChanges = changes(values);
            let d = {
                ticket: ticket,
                values: values,
                numDistinctValues: numDistinctValues,
                numChanges: numChanges,
            };
            data.push(d);
        }

        // Sort by number of changes.
        data.sort((a, b) => {
            return b.numChanges - a.numChanges;
        });

        data.forEach((d) => {
            // XXXX
            if (lastMinuteFilter && d.numChanges != 1) {
                return;
            }
            addRow(d.ticket, d.values, d.numDistinctValues, d.numChanges, metadataMap);
        });
        $('.loading').remove();
        $('.sortable-table').DataTable({
            "order": [
                [13, "desc"]
            ],
            "columnDefs": [{
                "targets": 0,
                "orderable": false
            }]
        });
        $('.dataTables_length').addClass('bs-select');
        $('select[name="tab_length"]').append($('<option>').attr('value', 9999999999999).text('All'));
        $('#tab').show();
    });
}

function finish() {
    $('.sortable-table').DataTable({
        "order": [
            [13, "desc"]
        ],
        "columnDefs": [{
            "targets": 0,
            "orderable": false
        }]
    });
}

// TODO: Could probably do this without reloading the page, but I dont' really care...
function reload() {
    let params = new URLSearchParams();
    if (rowFilter) {
        params.set('row', rowFilter);
    }
    if (secFilter) {
        params.set('section', secFilter);
    }
    if (lastMinuteFilter) {
        params.set('lastMinute');
    }
    let loc = String(document.location).replace(/\?.*/, '').replace(/#.*/, '');
    if (params.toString()) {
        loc += '?' + params.toString();
    }
    document.location = loc;
}

const images = {
    vividseats: "data:image/png;base64,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",
    stubhub: "data:image/png;base64,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",
    seatgeek: "data:image/png;base64,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",
};