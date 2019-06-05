import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from "@material-ui/core/Hidden";
import BattingAverageGraph from "src/js/graphs/BattingAverageGraph";
import SluggingPercentageGraph from "src/js/graphs/SluggingPercentageGraph";
import StlCardsStatsBackendClient from "src/js/common/StlCardsStatsBackendClient";

export default class PlayerDetailsPage extends Component {
    state = {
        data: {}
    };

    backendClient = new StlCardsStatsBackendClient();

    componentDidMount = async () => {
        const data = await this.backendClient.getPlayerData(this.props.match.params.playerName);
        this.setState({ data: data });
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