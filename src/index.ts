import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { IncomingMessage } from 'http';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { readFileSync } from 'fs';
import resolvers from './resolvers/resolvers';
import pandaScoreApi from './api/pandascore-api';

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

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

  
