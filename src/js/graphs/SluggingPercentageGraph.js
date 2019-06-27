import React, { Component } from 'react';
import Chart from 'chart.js';
import Constants from 'src/js/utils/Constants';
import GraphFunctions from "src/js/utils/GraphFunctions";

/**
 * React component that displays a slugging percentage graph
 * @props data: slugging percentage data from backend
 */
export default class SluggingPercentageGraph extends Component {
    static ABSOLUTE_MAX = 2;
    static ABSOLUTE_MIN = 0;
    static INTERVAL_EXPAND_PERCENT = 0.05;
    static DATA_PERCENT_REQUIRED = 0.90;

    chartRef = React.createRef();
    ticks = [];

    componentDidUpdate = () => {
        // Create the data array for the chart
        const chartData = GraphFunctions.generateChartData(this.props.data, Constants.GRAPH_DATA_TYPES.SLUGGING_PERCENTAGE);

        // Create the chart
        const myChartRef = this.chartRef.current.getContext("2d");
        const chart = this.createChart(myChartRef, chartData);

        // Focus the data range to the relevant portion
        GraphFunctions.adjustAxisRange(
            chart,
            GraphFunctions.getBoundingAxisValues(
                chartData,
                SluggingPercentageGraph.DATA_PERCENT_REQUIRED,
                SluggingPercentageGraph.INTERVAL_EXPAND_PERCENT,
                SluggingPercentageGraph.ABSOLUTE_MAX,
                SluggingPercentageGraph.ABSOLUTE_MIN
            ),
            this.ticks
        );

        // Omit extraneous ticks if necessary
        GraphFunctions.adjustAxisTickExtremes(chart, this.ticks)
    };

    /**
     * This function creates the chart object with settings heuristically determined to be ideal
     */
    createChart = (chartRef, chartData) => (
        new Chart(chartRef, {
            type: 'line',
            data: {
                datasets: [{
                    data: chartData,
                    fill: false,
                    borderColor: Constants.COLORS.LINE_COLOR,
                    borderWidth: 4,
                    pointRadius: 4
                }]
            },
            options: {
                layout: {
                    padding: {
                        left: 10,
                        right: 20
                    }
                },
                responsive: true,
                title: {
                    display: true,
                    text: "Slugging Percentage",
                    fontColor: Constants.COLORS.WHITE,
                    fontSize: 16,
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        bounds: "ticks",
                        distribution: "linear",
                        gridLines: {
                            tickMarkLength: 5,
                            color: Constants.COLORS.GRID_COLOR
                        },
                        type: 'time',
                        ticks: {
                            fontColor: Constants.COLORS.GRID_COLOR,
                            fontStyle: "bold",
                            fontSize: 14,
                            padding: 5,
                            source: "auto"
                        },
                        time: {
                            unit: "day",
                            displayFormats: {
                                day: "M/D"
                            },
                            tooltipFormat: "MMM D"
                        },

                    }],
                    yAxes: [{
                        bounds: "ticks",
                        gridLines: {
                            tickMarkLength: 5,
                            color: Constants.COLORS.GRID_COLOR
                        },
                        type: 'linear',
                        ticks: {
                            fontColor: Constants.COLORS.GRID_COLOR,
                            fontStyle: "bold",
                            fontSize: 14,
                            padding: 5,
                            callback: value => value.toFixed(3),
                        },
                        afterBuildTicks: (axis, ticks) => {
                            this.ticks = ticks;
                        }
                    }]
                },
                tooltips: {
                    displayColors: false,
                    backgroundColor: Constants.COLORS.BLACK,
                    titleFontSize: 14,
                    bodyFontSize: 14,
                    xPadding: 15,
                    yPadding: 15,
                    caretPadding: 5,
                    callbacks: {
                        label: (tooltipItem) => `${(Math.round(parseFloat(tooltipItem.value)*1000)/1000).toFixed(3)}`
                    }
                }
            }
        })
    );

    render() {
        return  (
            <canvas id="myChart" ref={this.chartRef}/>
        )
    }
}