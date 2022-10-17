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
        videogames: async(_,__,{ dataSources })=>{
          try{
            const videogamesList = await  dataSources.pandaScoreApi.getListOfVideoGames();
            return videogamesList.map(videogames =>({ 
              id: videogames.id,
              slug: videogames.slug,
              title: videogames.name,
              description: videogames.leagues  
             }))
          }catch(error){
            throw new Error(`Failed to query : ${error}`);
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

  export default resolvers;