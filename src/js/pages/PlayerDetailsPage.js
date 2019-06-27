import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import CommonFunctions from "src/js/utils/CommonFunctions";
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
                <div className="header">
                    <div>{CommonFunctions.reformatPlayerName(this.props.match.params.playerName)}</div>
                </div>
                { this.state.data.Position !== "P" ?
                    <div>
                        <Grid container>
                            <Grid item xs={1}/>
                            <Grid item xs={10} container alignItems="stretch">
                                <Grid item lg={6} xs={12}>
                                    <div className="flexContainer border details">
                                        <div className="flexChildPicture">
                                            <img className="detailsPageImage" src={this.state.data.officialImageSrc} alt="Photo"/>
                                        </div>
                                        <div className="flexChildBio">
                                            <div className="whiteText large verticalAlign">Player Info:</div>
                                            <div className="whiteText bioText">{`Height: ${this.state.data.Height}`}</div>
                                            <div className="whiteText bioText">{`Weight: ${this.state.data.Weight}`}</div>
                                            <div className="whiteText bioText">{`Age: ${this.state.data.Age}`}</div>
                                            <div className="whiteText bioText">{`Birth Date: ${this.state.data.BirthDate}`}</div>
                                            <div className="whiteText bioText">{`Jersey Number: ${this.state.data.JerseyNumber}`}</div>
                                            <div className="whiteText bioText">{`Position: ${this.state.data.Position}`}</div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <div className="border details">
                                        <div className="whiteText large verticalAlign">Current 2019 Season Stats:</div>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={1}/>
                        </Grid>
                        <div className="bottomMargin">
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
                        </div>
                    </div>:
                    <div className="border picture pictureArrayHeader centerText">
                        <div className="whiteText large">Pitcher stats have not been created yet, stay tuned!</div>
                    </div>
                }
            </div>
        )
    }
}