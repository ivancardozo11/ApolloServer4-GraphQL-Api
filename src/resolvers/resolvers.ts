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
          //by adding queries this way uses the parent argument to use the data from player/videogame/team already loaded, this makes  request faster
        //player(id): return all the info for a Player
        player: async(_,{ playerId },{ dataSources })=>{
            try{
              const playerById = await  dataSources.pandaScoreApi.getPlayer(playerId);
              return playerById.map( playerById =>({
                  id: playerById.id,
                  slug: playerById.slug,
                  birthday: playerById.birthday,
                  videogame: {
                      id: playerById.id,
                      name: playerById.name,
                      slug: playerById.slug
                  },
                  team:{
                      id: playerById.id,
                      slug: playerById.slug,
                      acronym: playerById.acronym,
                      name: playerById.name,
                      location: playerById.location,
                      players: playerById.players,
                      image: playerById.image_url,
                      videogame: playerById.current_videogame
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
      },
          // videogames: return a list of Videogames
        videogames: async(_,{ page, per_page },{ dataSources })=>{
          try{
            const videogamesList = await  dataSources.pandaScoreApi.getListOfVideoGames(page, per_page);
            return videogamesList.map(vd =>({ 
              id: vd.id,
              slug: vd.slug,
              name: vd.name  
             }))
          }catch(error){
            throw new Error(`Failed to query : ${error}`);
          }
        },
         // videogame(id): return all the details of a Videogame
         videogame: async(_,{ gameID },{ dataSources })=>{
            try{
            const videogamesList = await  dataSources.pandaScoreApi.getVideoGame(gameID);
            return videogamesList.map(vd =>({ 
              id: vd.id,
              slug: vd.slug,
              name: vd.name
             }))
          }catch(error){
            throw new Error(`Failed to query : ${error}`);
          }
           },
        //teams: return a list of Teams
        teams: async(_,{ page, per_page },{ dataSources }) =>{
            try {
              const teamList = await dataSources.pandascoreApi.getListOfTeams(page, per_page);
              return teamList.map(tl =>({
                id: tl.id,
                slug:tl.slug,
                acronym: tl.acronym,
                name: tl.name,
                location: tl.location,
                players: tl.players,
                image: tl.image_url,
                current_videogame: {
                    id: tl.id,
                    slug: tl.slug,
                    name: tl.name
                }
              }))
            
          } catch (error) {
            throw new Error(`Failed to query : ${error}`);
          }
       },
       //team(id): return all the details of a Team
      team:  async(_,{ teamId },{ dataSources }) =>{
        try {
            const team = await dataSources.pandascoreApi.getTeam(teamId);
            return team.map(tl =>({
              id: tl.id,
              slug:tl.slug,
              acronym: tl.acronym,
              name: tl.name,
              location: tl.location,
              players: tl.players,
              image: tl.image_url,
              current_videogame: {
                  id: tl.id,
                  slug: tl.slug,
                  name: tl.name
              }
            }))
          
        } catch (error) {
          throw new Error(`Failed to query : ${error}`);
        }
        } 
    }
  };

  export default resolvers;