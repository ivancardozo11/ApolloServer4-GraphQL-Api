import { RESTDataSource, WillSendRequestOptions  } from '@apollo/datasource-rest';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

class pandaScoreApi extends RESTDataSource { // highlight-line
    override baseURL = 'https://api.pandascore.co/';
    private token: string;
  
    constructor(options: { token: string; cache: KeyValueCache }) {
      super(options); // this sends our server's `cache` through
      this.token = options.token;
    }
  
    override willSendRequest(request: WillSendRequestOptions) {
      request.headers['authorization'] = this.token;
      request.params.set('Bearer 8sCOL40JsUIUb5haQHaNFUrX-C3CqyLGnt8-u4KZby4OU8EvhO4', this.token);
    }
  
  
    //players(limit?, page?): return a list of Players
    async getListOfPlayers(page, per_page) {
  
      const players = await this.get(`players?sort=&page=${page}&per_page=${per_page}`);
      return players;
      
    }
  
    //player(id): return all the info for a Player
    // return example :{ "id": 1, "name": "LoL", "slug": "league-of-legends" }
    async getPlayer(playerId)  {
      const result = await this.get(`players/${encodeURIComponent(playerId)}`);
      return result;
    }
  
  
    // videogames: return a list of Videogames
    async getListOfVideoGames(page, per_page)  {
  
      const result = await this.get(`videogames?page=${page}&per_page=${per_page}`);
      return result;
      
    }
    // videogame(id): return all the details of a Videogame
    /*slug examples:
      "cod-mw" ,"cs-go" ,"dota-2" , "fifa" ,"kog" ,"league-of-legends" ,"lol-wild-rift" ,"ow" ,"pubg","r6-siege","rl","starcraft-2","starcraft-brood-war","valorant" */
    async getVideoGame()  {
  
      return this.get(`videogames/fifa`);
    }
  
    //teams: return a list of Teams
  
    async getListOfTeams()  {
      return this.get(`teams?sort=&page=1&per_page=1`);
    }
    // team(id): return all the details of a Team
   // https://api.pandascore.co/teams/league-of-legends
    async getTeam(){
  
      return this.get(`teams/league-of-legends`);
    }
  }

  export default pandaScoreApi;