import { RESTDataSource, WillSendRequestOptions  } from '@apollo/datasource-rest';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { IncomingMessage } from 'http';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { readFileSync } from 'fs';
const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

  interface ContextValue {
    token: string;
    dataSources: {
        pandascoreApi: pandaScoreApi;
    };
  }
  // highlight-end

  class pandaScoreApi extends RESTDataSource { // highlight-line
    override baseURL = 'https://api.pandascore.co/';
    private token: string;
  
    constructor(options: { token: string; cache: KeyValueCache }) {
      super(options); // this sends our server's `cache` through
      this.token = options.token;
    }
  
    override willSendRequest(request: WillSendRequestOptions) {
      request.params.set('Bearer 8sCOL40JsUIUb5haQHaNFUrX-C3CqyLGnt8-u4KZby4OU8EvhO4', this.token);
    }

    //players(limit?, page?): return a list of Players
    async getListOfPlayers(limit, page)  {

      try{
        const data = await this.get(`players?sort=&page=${page}&per_page=${limit}`)
        return data;

      }catch(err){
        throw new Error(err);
      }
      
    }

    //player(id): return all the info for a Player
    // return example :{ "id": 1, "name": "LoL", "slug": "league-of-legends" }
    async getPlayer(player_id_or_slug)  {

      try{
        const data = await this.get(`players/${player_id_or_slug}`);
        return data;

      }catch(err){
        throw new Error(err);
      }  
    }


    // videogames: return a list of Videogames
    async getListOfVideoGames(limit, page)  {
      try{
        const data = await this.get(`videogames?page=${limit}&per_page=${page}`);
        return data;

      }catch(err){
        throw new Error(err);
      }     
    }
    // videogame(id): return all the details of a Videogame
    /*slug examples:
      "cod-mw" ,"cs-go" ,"dota-2" , "fifa" ,"kog" ,"league-of-legends" ,"lol-wild-rift" ,"ow" ,"pubg","r6-siege","rl","starcraft-2","starcraft-brood-war","valorant" */
    async getVideoGame(videogame_id_or_slug)  {
      try{
        const data = await this.get(`videogames/${videogame_id_or_slug}`);
        return data;

      }catch(err){
        throw new Error(err);
      }  
    }

    //teams: return a list of Teams

    async getListOfTeams(limit, page)  {
      try{
        const data = await this.get(`teams?sort=&page=${page}&per_page=${limit}`);
        return data;

      }catch(err){
        throw new Error(err);
      }  
    }
    // team(id): return all the details of a Team
   // https://api.pandascore.co/teams/league-of-legends
    async getTeam(team_id_or_slug){
      try{
        const data = await this.get(`teams/${team_id_or_slug}`);
        return data;

      }catch(err){
        throw new Error(err);
      }  
    }
  }
  
  // highlight-start
  


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
  
  function getTokenFromRequest(req: IncomingMessage) {
    const AuthHeader = req.headers.authorization || '';
    if(AuthHeader){
        const token = AuthHeader.split('Bearer')[1];
        if(token){
            try{    
                return token;
            }catch(err){
               throw new Error('Invalid/Expored token');
            }
        }
        throw new Error('Authentication token must be Bearer[token]');
    }
    throw new Error('Authentication header must be provided');
  };
  
  console.log(`🚀  Server ready at: ${url}`);

  
