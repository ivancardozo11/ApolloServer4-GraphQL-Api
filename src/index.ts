import { RESTDataSource, WillSendRequestOptions  } from '@apollo/datasource-rest';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { IncomingMessage } from 'http';


const typeDefs = `

 union Participant = Player | Team
 type Featured{
    participants: [Participant!]
 }

  type Article{
    title: String!
    text: String!
  }
 
  type Videogame{
    id: Int!
    slug: String!
    title: String!
    description: Article
    players: [Player!]
  }
  
  type Team{
    id: Int!
    slug: String!
    acronym: String!
    name: String!
    location: String!
    players: [Player!]!
    image: String
    videogame: Videogame!
  }
   
  type Player {
    id: Int!
    slug: String!
    birthdayYear: Int!
    birthday: String!
    team: Team
    videogame: Videogame!
    firstName: String!
    lastName: String!
    name: String!
    nationality: String
    image: String

  }

  type Query {
    player: Player
    players(limit: Int, page: Int): [Player!]
    team: Team
    teams: [Team!]
    videogame: Videogame
    videogames(limit: Int, page: Int): [Videogame!]
    featured: Featured
  }
`;

const resolvers = {
    Query: {
      //returns a list of players and sets a a limit of amount of pages and determine in wich page we are going to be
        players: async (_,__, { dataSources }) => {
            return dataSources.pandaScoreApi.getPlayers();
          },
      //player(id): return all the info for a Player
        player: async(_,{ id },{ dataSources })=>{
          return dataSources.pandascoreApi.getPlayer(id);
          },
          // videogames: return a list of Videogames
        videogames: async(_,__,{dataSources})=>{
          return dataSources.pandaScoreApi.getListOfVideoGames();

        }
    },
  };
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
    async getPlayers(limit, page)  {

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
  }
  
  // highlight-start
  


  const server = new ApolloServer<ContextValue>({
    typeDefs,
    resolvers,
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

  
