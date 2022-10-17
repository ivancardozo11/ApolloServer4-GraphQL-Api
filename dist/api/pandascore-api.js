import { RESTDataSource } from '@apollo/datasource-rest';
import * as dotenv from 'dotenv';
dotenv.config();
class pandaScoreApi extends RESTDataSource {
    constructor(options) {
        super(options); // this sends our server's `cache` through
        this.baseURL = 'https://api.pandascore.co/';
        this.token = options.token;
    }
    willSendRequest(request) {
        request.headers['authorization'] = this.token;
        request.params.set('${process.env.API_KEY}', this.token);
    }
    //players(limit?, page?): return a list of Players
    async getListOfPlayers(page, per_page) {
        const players = await this.get(`players?sort=&page=${page}&per_page=${per_page}`);
        return players;
    }
    //player(id): return all the info for a Player
    // return example :{ "id": 1, "name": "LoL", "slug": "league-of-legends" }
    async getPlayer(playerId) {
        const result = await this.get(`players/${encodeURIComponent(playerId)}`);
        return result;
    }
    // videogames: return a list of Videogames
    async getListOfVideoGames(page, per_page) {
        const result = await this.get(`videogames?page=${page}&per_page=${per_page}`);
        return result;
    }
    // videogame(id): return all the details of a Videogame
    /*slug examples:
      "cod-mw" ,"cs-go" ,"dota-2" , "fifa" ,"kog" ,"league-of-legends" ,"lol-wild-rift" ,"ow" ,"pubg","r6-siege","rl","starcraft-2","starcraft-brood-war","valorant" */
    async getVideoGame(gameID) {
        const result = await this.get(`videogames/${encodeURIComponent(gameID)}`);
        return result;
    }
    //teams: return a list of Teams
    async getListOfTeams(page, per_page) {
        const result = await this.get(`teams?sort=&page=${page}&per_page=${per_page}`);
        return result;
    }
    // team(id): return all the details of a Team
    // https://api.pandascore.co/teams/league-of-legends
    async getTeam(teamId) {
        return this.get(`teams/${encodeURIComponent(teamId)}`);
    }
}
export default pandaScoreApi;
