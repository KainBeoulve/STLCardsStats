import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import Grid from '@material-ui/core/Grid';

class PlayerSelectPage extends Component {
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

    componentDidMount = async () => {
        const playerDataArray = [];

        await Promise.all(
            PlayerSelectPage.PLAYER_NAMES.map(async name => {
                const playerData = await this.makeTempCall(name);
                playerDataArray.push(playerData);
            })
        );

        playerDataArray.sort((a, b) => a.PlayerName > b.PlayerName);

        this.setState({
            playerData: playerDataArray
        })
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
                <div className="header">
                    <div>Welcome to stlcardinalsstatistics.com</div>
                    <div>Select a player to view details</div>
                </div>
                <Grid container spacing={0}>
                    <Grid item xs={1}/>
                    <Grid item xs={10} container spacing={5}>
                        {this.state.playerData.length > 0 ?
                            this.state.playerData.map(player => (
                                <Grid item xs={6} md={4} lg={3} xl={2} key={player.PlayerName}>
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
export default PlayerSelectPage;