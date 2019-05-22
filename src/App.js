import React, { Component } from 'react'
import { ConfirmSignIn, SignIn, withAuthenticator } from 'aws-amplify-react';
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import Chart from 'chart.js';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';

Analytics.configure({ disabled: true});
Auth.configure({
    region: 'us-east-1',
    userPoolId: 'us-east-1_OBTaMqcJV',
    userPoolWebClientId: '7l2sb4mqghr6fil1hmaj5k1e0b'
});

Chart.defaults.global.defaultFontSize = 24;
Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif";
Chart.defaults.global.defaultColor = "rgba(255,0,0,1)";
Chart.defaults.global.elements.line.tension = 0;

class App extends Component {
    chartRef = React.createRef();

    componentDidMount = async () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        const data = await this.makeTempCall();

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
                    label: "Paul Goldschmidt's Batting Average",
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
                            unit: 'day',
                            tooltipFormat: "MMM DD"
                        },
                        distribution: 'linear'
                    }],
                    yAxes: [{
                        type: 'linear',
                        ticks: {
                            min: 0,
                            max: 0.35,
                            callback: value => value === 0 ? 0 : value.toFixed(3)
                        }
                    }]
                },
                tooltips: {
                    displayColors: false,
                    xPadding: 25,
                    yPadding: 25,
                    caretPadding: 18,
                    callbacks: {
                        label: (tooltipItem) => {
                            return `${(Math.round(parseFloat(tooltipItem.value)*1000)/1000).toFixed(3)}`
                        }
                    }
                }
            }
        });
    };

    getAuthToken = async () => {
        const data = await Auth.currentSession();
        return data.idToken.jwtToken;
    };

    makeTempCall = async () => (
        await this.checkStatus(
            await fetch("https://api.stlcardinalsstatistics.com/getPlayerInfo", {
                method: "POST",
                body: JSON.stringify({ "playerName": "Goldschmidt-Paul" }),
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

export default withAuthenticator(App, false, [
    <SignIn/>,
    <ConfirmSignIn/>
]);