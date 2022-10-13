// import { RESTDataSource, WillSendRequestOptions  } from '@apollo/datasource-rest';
// import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
//   class pandaScoreApi extends RESTDataSource { // highlight-line
//     override baseURL = 'https://api.pandascore.co/';
//     private token: string;
//     constructor(options: { token: string; cache: KeyValueCache }) {
//       super(options); // this sends our server's `cache` through
//       this.token = options.token;
//     }
//     override willSendRequest(request: WillSendRequestOptions) {
//       request.params.set('Bearer 8sCOL40JsUIUb5haQHaNFUrX-C3CqyLGnt8-u4KZby4OU8EvhO4', this.token);
//     }
//     //players(limit?, page?): return a list of Players
//     async getListOfPlayers(limit, page)  {
//       try{
//         const data = await this.get(`players?sort=&page=${page}&per_page=${limit}`)
//         return data;
//       }catch(err){
//         throw new Error(err);
//       }
//     }
//     //player(id): return all the info for a Player
//     // return example :{ "id": 1, "name": "LoL", "slug": "league-of-legends" }
//     async getPlayer(player_id_or_slug)  {
//       try{
//         const data = await this.get(`players/${player_id_or_slug}`);
//         return data;
//       }catch(err){
//         throw new Error(err);
//       }  
//     }
//     // videogames: return a list of Videogames
//     async getListOfVideoGames(limit, page)  {
//       try{
//         const data = await this.get(`videogames?page=${limit}&per_page=${page}`);
//         return data;
//       }catch(err){
//         throw new Error(err);
//       }     
//     }
//     // videogame(id): return all the details of a Videogame
//     /*slug examples:
//       "cod-mw" ,"cs-go" ,"dota-2" , "fifa" ,"kog" ,"league-of-legends" ,"lol-wild-rift" ,"ow" ,"pubg","r6-siege","rl","starcraft-2","starcraft-brood-war","valorant" */
//     async getVideoGame(videogame_id_or_slug)  {
//       try{
//         const data = await this.get(`videogames/${videogame_id_or_slug}`);
//         return data;
//       }catch(err){
//         throw new Error(err);
//       }  
//     }
//     //teams: return a list of Teams
//     async getListOfTeams(limit, page)  {
//       try{
//         const data = await this.get(`teams?sort=&page=${page}&per_page=${limit}`);
//         return data;
//       }catch(err){
//         throw new Error(err);
//       }  
//     }
//     // team(id): return all the details of a Team
//    // https://api.pandascore.co/teams/league-of-legends
//     async getTeam(team_id_or_slug){
//       try{
//         const data = await this.get(`teams/${team_id_or_slug}`);
//         return data;
//       }catch(err){
//         throw new Error(err);
//       }  
//     }
//   }
