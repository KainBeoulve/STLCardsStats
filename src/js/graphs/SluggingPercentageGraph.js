import React, { Component } from 'react';
import Chart from 'chart.js';
import moment from 'moment';
import Constants from 'src/js/utils/Constants';
import GraphFunctions from "src/js/utils/GraphFunctions";

/**
 * React component that displays a slugging percentage graph
 * @props data: batting data from backend
 */
export default class SluggingPercentageGraph extends Component {
    chartRef = React.createRef();
    ticks = [];

    componentDidUpdate = () => {
        // Create data objects for the chart
        const chartData = [];
        if (this.props.data.gameDates) {
            for (let i = 0; i < this.props.data.gameDates.length; i++) {
                chartData.push({
                    x: moment(this.props.data.gameDates[i].toString()).toDate(),
                    y: this.props.data.sluggingPercentage[i]
                });
            }
        }

        // Create the chart
        const myChartRef = this.chartRef.current.getContext("2d");
        const chart = this.createChart(myChartRef, chartData);

        // Focus the data range to the relevant portion
        GraphFunctions.adjustAxisRange(
            chart,
            GraphFunctions.getBoundingAxisValues(chartData, 0.95, 0.05, 2, 0),
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