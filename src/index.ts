import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { readFileSync } from 'fs';
import  getTokenFromRequest  from './auth/getTokenFromRequest.js';
import pandaScoreApi from './api/pandascore-api.js';
import resolvers from './resolvers/resolvers.js';
import wikiApi from './api/wikipedia-api.js';

//Import graphql schema
const typeDefs = readFileSync('./src/schema.graphql', { encoding: 'utf-8' });


  interface ContextValue {
    token: string;
    dataSources: {
        pandascoreApi: pandaScoreApi;
        wikiApi: wikiApi;
    };
  }


  const server = new ApolloServer<ContextValue>({
    typeDefs,// schema to query
    resolvers,// data inside the query
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageLocalDefault({ embed: true }), // embed: false if want code enabled in production. This will turn off the playground to query data.
    ]
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const token =  getTokenFromRequest(req); // header token
      const { cache } = server;
      return {
        token, // access token header
        dataSources: {// allow us to access  pandaScoreApi
            pandascoreApi: new pandaScoreApi({ cache, token }),
            wikiApi: new wikiApi({ cache }) // our second api to retrieve data
        },
      };
    },
  });
  
  console.log(`🚀  Server ready at: ${url}`);

  
