const resolvers = {
    Query: {
      //returns a list of players and sets a a limit of amount of pages and determine in wich page we are going to be
        players: async (_, {page, per_page}, { dataSources }) => {
            try{
              const players = await dataSources.pandaScoreApi.getListOfPlayers(page, per_page);
              return players.map(players =>({
                id: players.id,
                slug: players.slug,
                birthday: players.birthday,
                current_videogame: {
                    id: players.id,
                    title: players.name,
                    slug: players.slug
                },
                current_team:{
                    id: players.id,
                    slug: players.slug,
                    acronym: players.acronym,
                    name: players.name,
                    location: players.location,
                    image: players.image_url
                },
                firstname: players.first_name,
                lastName: players.last_name,
                name: players.name,
                nationality: players.nationality,
                image: players.image_url,
                role: players.role
              }))
            }catch(error){
              throw new Error(`Failed to query : ${error}`);
            }
          },
          // videogames: return a list of Videogames
        videogames: async(_,{page, per_page},{ dataSources })=>{
          try{
            const videogamesList = await  dataSources.pandaScoreApi.getListOfVideoGames(page, per_page);
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
    Player:{
        //player(id): return all the info for a Player
        player: async({ playerId } ,__,{ dataSources })=>{
            try{
              const playerById = await  dataSources.pandaScoreApi.getPlayer(playerId);
              return playerById.map( playerById =>({
                  id: playerById.id,
                  slug: playerById.slug,
                  birthday: playerById.birthday,
                  current_videogame: {
                      id: playerById.id,
                      title: playerById.name,
                      slug: playerById.slug
                  },
                  current_team:{
                      id: playerById.id,
                      slug: playerById.slug,
                      acronym: playerById.acronym,
                      name: playerById.name,
                      location: playerById.location,
                      image: playerById.image_url
                  },
                  firstname: playerById.first_name,
                  lastName: playerById.last_name,
                  name: playerById.name,
                  nationality: playerById.nationality,
                  image: playerById.image_url,
                  role: playerById.role
                }))
            }catch(error){
              throw new Error(`Failed to query : ${error}`);
        }
      }
    }
  };

  export default resolvers;