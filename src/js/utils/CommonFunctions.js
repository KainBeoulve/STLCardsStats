export default class CommonFunctions {
    static reformatPlayerName = (playerName) => {
        const nameArray = playerName.split("-");
        return `${nameArray[1]} ${nameArray[0]}`
    };
}