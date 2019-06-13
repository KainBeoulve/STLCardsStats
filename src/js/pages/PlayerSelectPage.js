import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import StlCardsStatsBackendClient from "src/js/common/StlCardsStatsBackendClient";

export default class PlayerSelectPage extends Component {
    state = {
        pitcherPlayerData: [],
        positionPlayerData: []
    };

    backendClient = new StlCardsStatsBackendClient();

    componentDidMount = async () => {

        const positionPlayerData = await this.backendClient.getAllPlayerNames(false);
        const pitcherPlayerData = await this.backendClient.getAllPlayerNames(true);

        positionPlayerData.sort((a, b) => a.PlayerName > b.PlayerName);
        pitcherPlayerData.sort((a, b) => a.PlayerName > b.PlayerName);

        this.setState({
            pitcherPlayerData,
            positionPlayerData
        })
    };

    render() {
        return (
            <div>
                <div className="header">
                    <div>Welcome to StlCardinalsStatistics.com</div>
                    <div>Select a player to view details</div>
                </div>
                <div className="border picture pictureArrayHeader centerText">
                    <div className="whiteText large">Position Players</div>
                </div>
                <Grid container spacing={0}>
                    <Grid item xs={1}/>
                    <Grid item xs={10} container spacing={0}>
                        {this.state.positionPlayerData.length > 0 ?
                            this.state.positionPlayerData.map(player => (
                                <Grid item xs={6} sm={4} md={3} lg={2} key={player.PlayerName}>
                                        <div className="centerText border picture">
                                            <Link to={`/player/${player.PlayerName}`}>
                                                <img src={player.officialImageSrc} alt="Photo"/>
                                            </Link>
                                            <div className="whiteText">{`${player.PlayerName.split("-")[1]} ${player.PlayerName.split("-")[0]}`}</div>
                                        </div>
                                </Grid>
                            )) : null
                        }
                    </Grid>
                    <Grid item xs={1}/>
                </Grid>
                <div className="border picture pictureArrayHeader centerText">
                    <div className="whiteText large">Pitchers</div>
                </div>
                <Grid container spacing={0}>
                    <Grid item xs={1}/>
                    <Grid item xs={10} container spacing={0}>
                        {this.state.pitcherPlayerData.length > 0 ?
                            this.state.pitcherPlayerData.map(player => (
                                <Grid item xs={6} sm={4} md={3} lg={2} key={player.PlayerName}>
                                    <div className="centerText border picture">
                                        <Link to={`/player/${player.PlayerName}`}>
                                            <img src={player.officialImageSrc} alt="Photo"/>
                                        </Link>
                                        <div className="whiteText">{`${player.PlayerName.split("-")[1]} ${player.PlayerName.split("-")[0]}`}</div>
                                    </div>
                                </Grid>
                            )) : null
                        }
                    </Grid>
                    <Grid item xs={1}/>
                </Grid>
            </div>
        )
    }
}