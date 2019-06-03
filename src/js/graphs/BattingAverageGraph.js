import React, { Component } from 'react';
import Chart from 'chart.js';
import moment from 'moment';

/**
 * React component that displays a batting average graph
 * @props data: batting data from backend
 */
class BattingAverageGraph extends Component {
    chartRef = React.createRef();

    ticks = [];

    color = "rgba(175,175,175,1)";

    componentDidUpdate = () => {
        const myChartRef = this.chartRef.current.getContext("2d");

        const chartData = [];

        if (this.props.data.gameDates) {
            for (let i = 0; i < this.props.data.gameDates.length; i++) {
                chartData.push({
                    x: moment(this.props.data.gameDates[i].toString()).toDate(),
                    y: this.props.data.battingAverage[i]
                });
            }
        }

        const chart = this.createChart(myChartRef, chartData);

        let { max: maxValue, min: minValue } = this.getAverageData(chartData);
        let maxIndex, minIndex;
        for (let i = this.ticks.length-1; i > 0; i--) {
            if ( this.ticks[i] > maxValue ) {
                minIndex = i;
                break;
            }
        }
        for (let i = 0; i < this.ticks.length-1 ; i++) {
            if ( this.ticks[i] < minValue ) {
                maxIndex = i;
                break;
            }
        }

        chart.options.scales.yAxes[0].ticks.min = this.ticks[maxIndex];
        chart.options.scales.yAxes[0].ticks.max = this.ticks[minIndex];
        chart.update();

        const interval = this.ticks[1]-this.ticks[2];

        chart.options.scales.yAxes[0].ticks.min = this.ticks[this.ticks.length - 2] - interval;
        chart.options.scales.yAxes[0].ticks.max = this.ticks[1] + interval;
        chart.options.scales.yAxes[0].ticks.stepSize = interval;
        chart.update();
    };

    createChart = (chartRef, chartData) => (
        new Chart(chartRef, {
            type: 'line',
            data: {
                datasets: [{
                    data: chartData,
                    fill: false,
                    borderColor: "#c4203c",
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
                    text: `Batting Average`,
                    fontColor: "white",
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
                            color: this.color
                        },
                        type: 'time',
                        ticks: {
                            fontColor: this.color,
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
                            color: this.color
                        },
                        type: 'linear',
                        ticks: {
                            autoSkip: false,
                            fontColor: this.color,
                            fontStyle: "bold",
                            fontSize: 14,
                            padding: 5,
                            min: 0,
                            callback: value => value.toFixed(3),
                        },
                        afterBuildTicks: (axis, ticks) => {
                            this.ticks = ticks;
                        }
                    }]
                },
                tooltips: {
                    displayColors: false,
                    backgroundColor: "rgba(0,0,0,1)",
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

    /**
     * This function calculates the maximum and minimum values of the y axis of the graph where 90% of the data is shown
     * It is meant to prevent huge outlier data from ruining the visualization of trends in the data
     * @param data
     * @returns {{min: number, max: number}}
     */
    getAverageData = (data) => {
        let numerator = 0;
        let denominator = 0;
        data.forEach(entry => {
            numerator = numerator + entry.y;
            denominator++;
        });
        const average = numerator/denominator;

        let isNinetyPercentOfDataShown = false;
        let maxValue = average;

        while (!isNinetyPercentOfDataShown && maxValue < 0.4) {
            let total = 0;
            let shown = 0;
            data.forEach(entry => {
                if (entry.y <= maxValue) {
                    total++;
                    shown++;
                } else {
                    total++;
                }
            });
            if (shown/total > 0.9) {
                isNinetyPercentOfDataShown = true;
            } else {
                maxValue = maxValue + 0.05*average;
            }
        }

        isNinetyPercentOfDataShown = false;
        let minValue = average;

        while (!isNinetyPercentOfDataShown && minValue > 0) {
            let total = 0;
            let shown = 0;
            data.forEach(entry => {
                if (entry.y >= minValue) {
                    total++;
                    shown++;
                } else {
                    total++;
                }
            });
            if (shown/total > 0.9) {
                isNinetyPercentOfDataShown = true;
            } else {
                minValue = minValue - 0.05*average;
            }
        }

        return {max: Math.min(maxValue, 0.45), min: Math.max(0, minValue)};
    };

    render() {
        return  (
            <canvas id="myChart" ref={this.chartRef}/>
        )
    }
}

export default BattingAverageGraph;