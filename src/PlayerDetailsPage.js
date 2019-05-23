import React, { Component } from 'react';
import Auth from '@aws-amplify/auth';
import Chart from 'chart.js';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';

Chart.defaults.global.defaultFontSize = 16;
Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif";
Chart.defaults.global.defaultColor = "rgba(255,0,0,1)";

class PlayerDetailsPage extends Component {
    chartRef = React.createRef();

    static SCALING_FACTOR = 0.75;

    componentDidMount = async () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        const data = await this.makeTempCall(this.props.match.params.playerName);

        const chartData = [];

        for (let i = 0; i < data.gameDates.length; i++) {
            chartData.push({
                x: moment(data.gameDates[i].toString()).toDate(),
                y: data.battingAverage[i]
            });
        }

        new Chart(myChartRef, {
            type: 'line',
            data: {
                datasets: [{
                    label: `${data.PlayerName.split("-")[1]} ${data.PlayerName.split("-")[0]}'s Batting Average`,
                    data: chartData,
                    fill: false,
                    borderColor: "rgba(255,0,0,1)",
                    borderWidth: 5,
                    pointRadius: 5
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            ticks: {
                                source: "data"
                            },
                            unit: "day",
                            displayFormats: {
                                day: "MMM D"
                            },
                            tooltipFormat: "MMM DD"
                        },
                        distribution: 'linear'
                    }],
                    yAxes: [{
                        type: 'linear',
                        ticks: {
                            min: .000,
                            max: .400,
                            callback: value => value.toFixed(3)
                        }
                    }]
                },
                tooltips: {
                    displayColors: false,
                    xPadding: 25,
                    yPadding: 25,
                    caretPadding: 18,
                    callbacks: {
                        label: (tooltipItem) => `${
                            (Math.round(parseFloat(tooltipItem.value)*1000)/1000).toFixed(3)
                        }`
                    }
                }
            }
        });
    };

    /* TODO: Rethink this
    getAverageData = (data) => {
        let numerator = 0;
        let denominator = 0;
        data.forEach(entry => {
            numerator = numerator + entry.y;
            denominator++;
        });
        const average = numerator/denominator;
        return {max: average*(1 + PlayerDetailsPage.SCALING_FACTOR), min: average*(1- PlayerDetailsPage.SCALING_FACTOR)};
    };
    */

    getAuthToken = async () => {
        const data = await Auth.currentSession();
        return data.idToken.jwtToken;
    };

    makeTempCall = async (playerName) => (
        await this.checkStatus(
            await fetch("https://api.stlcardinalsstatistics.com/getPlayerInfo", {
                method: "POST",
                body: JSON.stringify({ "playerName": playerName }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": await this.getAuthToken()
                }
            })
        )
    );

    checkStatus = async (response) => {
        if (response.ok) {
            return response.json();
        }
        const jsonResponse = await response.json();
        throw new Error(`${response.statusText}: ${jsonResponse.message}`);
    };

    render() {
        return  (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <canvas id="myChart" ref={this.chartRef}/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default PlayerDetailsPage;