import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { RESTDataSource } from '@apollo/datasource-rest';
// const typeDefs = readFileSync('./src/schema.graphql', { encoding: 'utf-8' });
const typeDefs = ` union Participant = Player | Team

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
   players: [Player!]!
   team: Team
   teams: [Team!]
   videogame: Videogame
   videogames(limit: Int, page: Int): [Videogame!]
   featured: Featured
 }
`;
class pandaScoreApi extends RESTDataSource {
    constructor(options) {
        super(options); // this sends our server's `cache` through
        this.baseURL = 'https://api.pandascore.co/';
        this.token = options.token;
    }
    willSendRequest(request) {
        request.headers['authorization'] = this.token;
        request.params.set('Bearer 8sCOL40JsUIUb5haQHaNFUrX-C3CqyLGnt8-u4KZby4OU8EvhO4', this.token);
    }
    //players(limit?, page?): return a list of Players
    async getListOfPlayers() {
        return this.get(`players?sort=&page=number=1&size=1&per_page=1`);
    }
    //player(id): return all the info for a Player
    // return example :{ "id": 1, "name": "LoL", "slug": "league-of-legends" }
    async getPlayer(player_id_or_slug) {
        try {
            const data = await this.get(`players/${player_id_or_slug}`);
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    // videogames: return a list of Videogames
    async getListOfVideoGames(limit, page) {
        try {
            const data = await this.get(`videogames?page=${limit}&per_page=${page}`);
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    // videogame(id): return all the details of a Videogame
    /*slug examples:
      "cod-mw" ,"cs-go" ,"dota-2" , "fifa" ,"kog" ,"league-of-legends" ,"lol-wild-rift" ,"ow" ,"pubg","r6-siege","rl","starcraft-2","starcraft-brood-war","valorant" */
    async getVideoGame(videogame_id_or_slug) {
        try {
            const data = await this.get(`videogames/${videogame_id_or_slug}`);
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    //teams: return a list of Teams
    async getListOfTeams(limit, page) {
        try {
            const data = await this.get(`teams?sort=&page=${page}&per_page=${limit}`);
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    // team(id): return all the details of a Team
    // https://api.pandascore.co/teams/league-of-legends
    async getTeam(team_id_or_slug) {
        try {
            const data = await this.get(`teams/${team_id_or_slug}`);
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }
}
const resolvers = {
    Query: {
        //returns a list of players and sets a a limit of amount of pages and determine in wich page we are going to be
        players: async (_, __, { dataSources }) => {
            try {
                const playerList = await dataSources.pandaScoreApi.getListOfPlayers();
                return playerList.map(player => ({
                    id: player.id,
                    slug: player.slug,
                    birthday: player.birthday,
                    team: player.current_team,
                    videogame: player.current_videogame,
                    firstname: player.first_name,
                    lastName: player.last_name,
                    name: player.name,
                    nationality: player.nationality,
                    image: player.image_url
                }));
            }
            catch (error) {
                throw error;
            }
        },
        //player(id): return all the info for a Player
        player: async (_, { id }, { dataSources }) => {
            return dataSources.pandascoreApi.getPlayer(id);
        },
        // videogames: return a list of Videogames
        videogames: async (_, __, { dataSources }) => {
            return dataSources.pandaScoreApi.getListOfVideoGames();
        },
        // videogame(id): return all the details of a Videogame
        videogame: async (_, { id }, { dataSources }) => {
            return dataSources.pandaScoreApi.getVideoGame(id);
        },
        teams: async (_, __, { dataSources }) => {
            return dataSources.pandascoreApi.getListOfTeams();
        },
        //team(id): return all the details of a Team
        team: async (_, { id }, { dataSources }) => {
            return dataSources.pandaScoreApi.getTeam(id);
        }
    },
};
const server = new ApolloServer({ typeDefs, resolvers });
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
// this file is here couse there is a proble while importing Error [ERR_MODULE_NOT_FOUND]: Cannot find module and export is not working
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
