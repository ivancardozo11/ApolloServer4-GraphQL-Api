This is a POC for a Graphql api.

In this file you will find how to start the aplication 
and the following queries to fetch data.


1) players(limit?, page?): return a list of Players

Inside apollo playground:


Operation:



query Players($page: Int, $perPage: Int) {
  players(page: $page, per_page: $perPage) {
    id
    slug
    birthday
    videogame {
      id
      name
      slug
    }
    team {
      id
      slug
      acronym
      name
      location
      players {
        id
        slug
        birthday
        firstName
        lastName
        name
        nationality
        image
        role
      }
      image
    }
    firstName
    lastName
    name
    nationality
    image
    role
  }
}

-------------------------------------------------------
Variables: // put this object in the Variables section inside apollo playground
           //to query by players by page
{
  "page": 1,
  "perPage": 1
}

--------------------------------------------------------

2) player(id): return all the info for a Player

//Selects the id and return a player by id

Operation:

query Player($playerId: Int!) {
  player(id: $playerId) {
    id
    slug
    birthday
    videogame {
      id
      name
      slug
    }
    team {
      id
      slug
      acronym
      name
      location
      players {
        id
        slug
        birthday
        firstName
        lastName
        name
        nationality
        image
        role
      }
      image
    }
    firstName
    lastName
    name
    nationality
    image
    role
  }
}



----------------------------------------------------------
Variables:
// put this object in the Variables section inside apollo playground
           //to query by players by id

{
  "playerId": 1
}
-----------------------------------------------------------

3) videogames: return a list of Videogames

//This query retuns a list of videogames

query Videogames($limit: Int, $page: Int) {
  videogames(limit: $limit, page: $page) {
    id
    name
    slug
  }
}


------------------------------------------------------------
Variables:


{
  "limit": 1,
  "page": 1
}