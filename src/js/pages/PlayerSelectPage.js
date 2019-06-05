import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import StlCardsStatsBackendClient from "src/js/common/StlCardsStatsBackendClient";

export default class PlayerSelectPage extends Component {
    state = {
        playerData: []
    };

    static PLAYER_NAMES = [
        "Goldschmidt-Paul",
        "Fowler-Dexter",
        "DeJong-Paul",
        "Molina-Yadier",
        "Carpenter-Matt",
        "Ozuna-Marcell",
        "Bader-Harrison",
        "Martinez-Jose",
        "Wong-Kolten"
    ];

    backendClient = new StlCardsStatsBackendClient();

    componentDidMount = async () => {
        const playerDataArray = [];

        await Promise.all(
            PlayerSelectPage.PLAYER_NAMES.map(async name => {
                const playerData = await this.backendClient.getPlayerData(name);
                playerDataArray.push(playerData);
            })
        );

        playerDataArray.sort((a, b) => a.PlayerName > b.PlayerName);

        this.setState({
            playerData: playerDataArray
        })
    };

    render() {
        return (
            <div>
                <div className="header">
                    <div>Welcome to StlCardinalsStatistics.com</div>
                    <div>Select a player to view details</div>
                </div>
                <Grid container spacing={0}>
                    <Grid item xs={1}/>
                    <Grid item xs={10} container spacing={5}>
                        {this.state.playerData.length > 0 ?
                            this.state.playerData.map(player => (
                                <Grid item xs={6} sm={4} md={3} lg={2} key={player.PlayerName}>
                                        <div className="centerText pictureBorder">
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