define([
    //here are the dependencies;
    'jquery',
    './properties',
    './initial',
    './js/chart'
],
    function ($, props) {
        'use strict';
        var datasets = [];
        return {

            //def of layout-panels - ref to properties.js / initial.js
            definition: props,
            initialProperties: initial,


            //Paint resp.Rendering logic
            paint: function ($element, layout) {
                //Create hyperCube var
                var hc = layout.qHyperCube;
                console.log("Layout:", layout);
                console.log("Data returned:", hc);

                //Empty the element
                $element.empty();

                // Create datasets
                var dataLabels = hc.qDataPages[0].qMatrix.map(function (d) { return d[0].qText; })

                datasets = [];
                var colors = new Array(layout.props.firstDataset.color, layout.props.secondDataset.color, layout.props.thirdDataset.color, layout.props.fourthDataset.color, layout.props.fifthDataset.color);
                for (var i = 0; i < hc.qMeasureInfo.length; i++) {
                    datasets.push(
                        {
                            label: hc.qMeasureInfo[i].qFallbackTitle,
                            backgroundColor: colors[i],
                            fill: 'origin',
                            data: hc.qDataPages[0].qMatrix.map(function (d) { return { y: d[i + 1].qNum } }),
                            stack: 'Stack' + i
                        }
                    )
                }

                //If props.stacked = true then stack the bars, else don't
                if (layout.props.stacked === true) {
                    for (let i = 0; i < hc.qMeasureInfo.length; i++) {
                        datasets[i].stack = 'Uno';
                    }
                } else {
                    for (let i = 0; i < hc.qMeasureInfo.length; i++) {
                        datasets[i].stack = i;
                    }
                }

                //If props.randBtn is clicked, randomize colors
                if (layout.props.randBtn) {
                    console.log(datasets[i].backgroundColor);
                }



                //CHART
                var canvas_id = layout.qInfo.qId + "_chartjs_bar";
                //Get width and height of the element
                var ext_width = $element.width(), ext_height = $element.height();
                $element.html('<canvas id="' + canvas_id + '" width="' + ext_width + '" height="' + ext_height + '"></canvas>');
                var ctx = document.getElementById(canvas_id).getContext('2d');

                var myChart = new Chart(ctx, {
                    // Chart TYPE
                    type: 'bar',

                    // Chart DATA
                    data: {
                        //X AXIS
                        labels: dataLabels,
                        //Y AXIS
                        datasets: datasets
                    },

                    // Chart OPTIONS
                    options: {
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                        },
                        interaction: {
                            intersect: false,
                        },
                        scales: {
                            x: {
                                stacked: false
                            },
                            y: {
                                stacked: true
                            },
                            xAxes: [{
                                gridLines: {
                                    display: true
                                }
                            }],
                            yAxes: [{
                                gridLines: {
                                    display: true
                                }
                            }]
                        }
                    }

                });

                //If props.grid = true, then enable the grid, else don't
                if (layout.props.grid === true) {
                    myChart.options.scales.xAxes[0].gridLines.display = true;
                    myChart.options.scales.yAxes[0].gridLines.display = true;
                } else {
                    myChart.options.scales.xAxes[0].gridLines.display = false;
                    myChart.options.scales.yAxes[0].gridLines.display = false;
                }


                console.log('------------ END ------------');
            }
        };
    });
