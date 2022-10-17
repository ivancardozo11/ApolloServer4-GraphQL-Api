import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { readFileSync } from 'fs';
import { RESTDataSource, WillSendRequestOptions  } from '@apollo/datasource-rest';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
import  getTokenFromRequest  from './auth/getTokenFromRequest.js';

const typeDefs = readFileSync('./src/schema.graphql', { encoding: 'utf-8' });


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
    return players.data;
    
  }

  //player(id): return all the info for a Player
  // return example :{ "id": 1, "name": "LoL", "slug": "league-of-legends" }
  async getPlayer(id)  {
    const result = await this.get(`players/${id}`);
    return result;
  }


  // videogames: return a list of Videogames
  async getListOfVideoGames()  {

    return this.get(`videogames?page=1&per_page=1`);
    
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


const resolvers = {
  Query: {
    //returns a list of players and sets a a limit of amount of pages and determine in wich page we are going to be
      players: async (_, args, { dataSources }) => {
          try{
            const { page, per_page } = args;
            const players = await dataSources.pandaScoreApi.getListOfPlayers(
              page,
              per_page
            );
            return players;
          }catch(error){
            throw new Error(`Failed to query : ${error}`);
          }
        },
    //player(id): return all the info for a Player
      player: async(_,{ id },{ dataSources })=>{
        try{
          const playerById = await  dataSources.pandaScoreApi.getPlayer(id);
          return { 
            data:{
              id: playerById.id,
              slug: playerById.slug,
              birthday: playerById.birthday,
              videogame: playerById.current_videogame,
              team: playerById.current_team,
              firstname: playerById.first_name,
              lastName: playerById.last_name,
              name: playerById.name,
              nationality: playerById.nationality,
              image: playerById.image_url,
              role: playerById.role
            }
           }
        }catch(error){
          throw new Error(`Failed to query : ${error}`);
        }
        },
        // videogames: return a list of Videogames
      videogames: async(_,__,{dataSources})=>{
        try{
          const videogamesList = await  dataSources.pandaScoreApi.getListOfVideoGames();
          return videogamesList.map(videogames =>({ 
            id: videogames.id,
            slug: videogames.slug,
            title: videogames.name,
            description: videogames.leagues  
           }))
        }catch(error){
          throw error;
        }
      },
     // videogame(id): return all the details of a Videogame
      videogame: async(_,{ id },{ dataSources })=>{
      return dataSources.pandaScoreApi.getVideoGame(id);
     },
      teams: async(_,__,{ dataSources }) =>{
        return dataSources.pandascoreApi.getListOfTeams();
     },
     //team(id): return all the details of a Team
      team: async(_,{ id },{dataSources}) =>{
        return dataSources.pandaScoreApi.getTeam(id);
     }   
  },
};

  interface ContextValue {
    token: string;
    dataSources: {
        pandascoreApi: pandaScoreApi;
    };
  }


  const server = new ApolloServer<ContextValue>({
    typeDefs,
    resolvers,
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ]
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const token =  getTokenFromRequest(req);
      const { cache } = server;
      return {
        token,
        dataSources: {
            pandascoreApi: new pandaScoreApi({ cache, token }),
        },
      };
    },
  });

  // this file is here couse there is a proble while importing Error [ERR_MODULE_NOT_FOUND]: Cannot find module and export is not working
  // function getTokenFromRequest(req: IncomingMessage) {
  //   const AuthHeader = req.headers.authorization || '';
  //   if(AuthHeader){
  //       const token = AuthHeader.split('Bearer')[1];
  //       if(token){
  //           try{    
  //               return token;
  //           }catch(err){
  //              throw new Error('Invalid/Expored token');
  //           }
  //       }
  //       throw new Error('Authentication token must be Bearer[token]');
  //   }
  //   throw new Error('Authentication header must be provided');
  // };
  
  console.log(`🚀  Server ready at: ${url}`);

  
