import Auth from '@aws-amplify/auth';

export default class StlCardsStatsBackendClient {
    static BACKEND_URL = "https://api.stlcardinalsstatistics.com";

    getPlayerData = async (playerName) => (
        await this.checkStatus(
            await fetch(`${StlCardsStatsBackendClient.BACKEND_URL}/getPlayerInfo?playerName=${playerName}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": await this.getAuthToken()
                }
            })
        )
    );

    getAllPlayerNames = async (getPitchers) => (
        await this.checkStatus(
            await fetch(`${StlCardsStatsBackendClient.BACKEND_URL}/getAllPlayerNames?getPitchers=${getPitchers}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": await this.getAuthToken()
                }
            })
        )
    );

    getAuthToken = async () => {
        const data = await Auth.currentSession();
        return data.idToken.jwtToken;
    };

    checkStatus = async (response) => {
        if (response.ok) {
            return response.json();
        }
        const jsonResponse = await response.json();
        throw new Error(`${response.statusText}: ${jsonResponse.message}`);
    };
}