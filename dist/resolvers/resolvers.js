//  const resolvers = {
//     Query: {
//       //returns a list of players and sets a a limit of amount of pages and determine in wich page we are going to be
//         players: async (_,__, { dataSources }) => {
//             return dataSources.pandaScoreApi.getListOfPlayers();
//           },
//       //player(id): return all the info for a Player
//         player: async(_,{ id },{ dataSources })=>{
//           return dataSources.pandascoreApi.getPlayer(id);
//           },
//           // videogames: return a list of Videogames
//         videogames: async(_,__,{dataSources})=>{
//           return dataSources.pandaScoreApi.getListOfVideoGames();
//         },
//        // videogame(id): return all the details of a Videogame
//         videogame: async(_,{ id },{ dataSources })=>{
//         return dataSources.pandaScoreApi.getVideoGame(id);
//        },
//         teams: async(_,__,{dataSources}) =>{
//           return dataSources.pandascoreApi.getListOfTeams();
//        },
//        //team(id): return all the details of a Team
//         team: async(_,{id},{dataSources}) =>{
//           return dataSources.pandaScoreApi.getTeam(id);
//        }   
//     },
//   };
//   export default resolvers;
