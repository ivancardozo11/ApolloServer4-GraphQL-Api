import { RESTDataSource } from '@apollo/datasource-rest';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
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
    videogames: [Videogame!]
    featured: Featured
  }
`;
const resolvers = {
    Query: {
        //returns a list of players and sets a a limit of amount of pages and determine in wich page we are going to be
        players: async (_, __, { dataSources }) => {
            return dataSources.pandaScoreApi.getPlayers();
        },
        player: async (_, { id }, { dataSources }) => {
            return dataSources.pandascoreApi.getPlayer(id);
        },
    },
};
// highlight-end
class pandaScoreApi extends RESTDataSource {
    constructor(options) {
        super(options); // this sends our server's `cache` through
        this.baseURL = 'https://api.pandascore.co/';
        this.token = options.token;
    }
    willSendRequest(request) {
        request.params.set('Bearer 8sCOL40JsUIUb5haQHaNFUrX-C3CqyLGnt8-u4KZby4OU8EvhO4', this.token);
    }
    async getPlayers(limit, page) {
        try {
            const data = await this.get(`players?sort=&page=1&per_page=1`);
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async getPlayer(id) {
        try {
            const data = await this.get(`players/${id}`);
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }
}
// highlight-start
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
        const token = getTokenFromRequest(req);
        const { cache } = server;
        return {
            token,
            dataSources: {
                pandascoreApi: new pandaScoreApi({ cache, token }),
            },
        };
    },
});
function getTokenFromRequest(req) {
    const AuthHeader = req.headers.authorization || '';
    if (AuthHeader) {
        const token = AuthHeader.split('Bearer')[1];
        if (token) {
            try {
                return token;
            }
            catch (err) {
                throw new Error('Invalid/Expored token');
            }
        }
        throw new Error('Authentication token must be Bearer[token]');
    }
    throw new Error('Authentication header must be provided');
}
;
console.log(`🚀  Server ready at: ${url}`);
