import React, { Component } from 'react';
import Auth from '@aws-amplify/auth';
import Grid from '@material-ui/core/Grid';
import Hidden from "@material-ui/core/Hidden";
import BattingAverageGraph from "src/js/graphs/BattingAverageGraph";
import SluggingPercentageGraph from "src/js/graphs/SluggingPercentageGraph";

export default class PlayerDetailsPage extends Component {
    state = {
        data: {}
    };

    componentDidMount = async () => {
        const data = await this.makeTempCall(this.props.match.params.playerName);

        this.setState({ data: data });
    };

    getAuthToken = async () => {
        const data = await Auth.currentSession();
        return data.idToken.jwtToken;
    };

    makeTempCall = async (playerName) => (
        await this.checkStatus(
            await fetch(`https://api.stlcardinalsstatistics.com/getPlayerInfo?playerName=${playerName}`, {
                method: "GET",
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
                <div className="verticalMargin">
                    <Grid container spacing={2}>
                        <Grid item xs={1}/>
                        <Grid item lg={5} xs={10}>
                            <div className="graphBorder">
                                <BattingAverageGraph data={this.state.data}/>
                            </div>
                        </Grid>
                        <Hidden lgUp={true}>
                            <Grid item xs={1}/>
                            <Grid item xs={1}/>
                        </Hidden>
                        <Grid item lg={5} xs={10}>
                            <div className="graphBorder">
                                <SluggingPercentageGraph data={this.state.data}/>
                            </div>
                        </Grid>
                        <Grid item xs={1}/>
                    </Grid>
                </div>
            </div>
        )
    }
}