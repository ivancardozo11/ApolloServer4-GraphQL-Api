# ApolloServer4-GraphQL-Api


This project is a POC of Apollo Server 4

Implements a full backend with:

- Bearer authentication token
- Api from pandaScore 
- Api from wikipedia
- GraphQL tables.
- Restdatasource library from Apollo, to wrap a REST API using GRAPHQL.
- Use Typescript and Javascript.








Quick start: 

-npm run start

// index.ts 

: ApolloServerPluginLandingPageLocalDefault({ embed: false }), --> this means prod, write: true if you want acces to playground to query

Server will start in: Server ready at: http://localhost:4000/

This is a POC for a Graphql API.

In this file you will find how to start the aplication 
and the following queries to fetch data inside Apollo server playground


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

Operation:




query Videogames($limit: Int, $page: Int) {
  videogames(limit: $limit, page: $page) {
    id
    name
    slug
  }
}


------------------------------------------------------------
Variables:
// put this object in the Variables section inside apollo playground
           //to query videogames list

{
  "per_page": 1,
  "page": 1
}

---------------------------------------------------------

4) videogame(id): return all the details of a Videogame


Operation:

//This query retuns videogames by id


query Videogame($videogameId: Int!) {
  videogame(id: $videogameId) {
    id
    name
    slug
  }
}


Variables:

// put this object in the Variables section inside apollo playground
           //to query videogames by id

{
  "videogameId": 1
}

---------------------------------------------------------------


5) teams: return a list of Teams

//This query retuns a list of videogame teams by page and amount of pages you want.

Operation:

query Team($page: Int, $perPage: Int) {
  teams(page: $page, per_page: $perPage) {
    id
    slug
    acronym
    name
    location
    players {
      id
      slug
      birthday
      team {
        id
        slug
        acronym
        name
        location
        image
      }
      firstName
      lastName
      name
      nationality
      image
      role
    }
    image
    videogame {
      id
      name
      slug
    }
  }
}
-----------------------------------------------------------------------------------
Variables

// put this object in the Variables section inside apollo playground
// to query videogames by id

{
  "page": 1,
  "perPage": 1
}
------------------------------------------------------------------------------------

6)

teams: return videogame Teams by id

//This query retuns  videogame teams by id

Operation:

query Team($teamId: Int!) {
  team(id: $teamId) {
    id
    slug
    acronym
    name
    location
    players {
      id
      slug
      birthday
      team {
        id
        slug
        acronym
        name
        location
        image
      }
      firstName
      lastName
      name
      nationality
      image
      role
    }
    image
    videogame {
      id
      name
      slug
    }
  }
}
-----------------------------------------------------------------------------------
Variables

// put this object in the Variables section inside apollo playground
// to query videogames by id

{
  "teamId": 100
}

-----------------------------------------------------------
7) featured:
 participants: return a random mix of players and teams 


 query Participants {
  featured {
    participants {
      ... on Player {
        slug
        birthday
        team {
          id
          slug
          acronym
          name
          location
          image
        }
      }
      ... on Team {
        id
        slug
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
      }
    }
  }
}
