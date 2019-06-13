import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import BattingAverageGraph from "src/js/graphs/BattingAverageGraph";
import SluggingPercentageGraph from "src/js/graphs/SluggingPercentageGraph";
import StlCardsStatsBackendClient from "src/js/common/StlCardsStatsBackendClient";

export default class PlayerDetailsPage extends Component {
    state = {
        data: { Position: null}
    };

    backendClient = new StlCardsStatsBackendClient();

    componentDidMount = async () => {
        const data = await this.backendClient.getPlayerData(this.props.match.params.playerName);
        this.setState({ data: data });
    };

    render() {
        return  (
            <div>
                { this.state.data.Position !== "P" ?
                    <div className="verticalMargin">
                        <Grid container>
                            <Grid item xs={1}/>
                            <Grid item xs={10} container>
                                <Grid item lg={6} xs={12}>
                                    <div className="border graph">
                                        <BattingAverageGraph data={this.state.data}/>
                                    </div>
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <div className="border graph">
                                        <SluggingPercentageGraph data={this.state.data}/>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={1}/>
                        </Grid>
                    </div> :
                    <div className="border picture pictureArrayHeader centerText">
                        <div className="whiteText large">Pitcher stats have not been created yet, stay tuned!</div>
                    </div>
                }
            </div>
        )
    }
}