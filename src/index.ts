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
    players: [Player!]
    team: Team
    teams: [Team!]
    videogame: Videogame
    videogames: [Videogame!]
    featured: Featured
  }
`;

const resolvers = {
    Query: {
        players: async (_, __, { dataSources }) => {
            return dataSources.pandaScoreApi.getPlayers();
          },
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
  
    async getPlayers(id: string)  {
      return this.get(`players`);
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

    let token = '';
    req.setEncoding("utf8");
    if(IncomingMessage){
      token += IncomingMessage;
    }
   return token;
  }
  
  console.log(`🚀  Server ready at: ${url}`);

  
