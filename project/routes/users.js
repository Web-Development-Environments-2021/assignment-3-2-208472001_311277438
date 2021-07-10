var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
const coaches_utils = require("./utils/coaches_utils");

router.get("/lastSearch", async (req, res, next) => {
  try {
    if (req.session.lastSearch == null) {
      res.status(200).send(null);
    }
    else {
      res.status(200).send(req.session.lastSearch);
    }
  } catch (error) {
    next(error);
  }
});


router.get("/searchByName/:Name", async (req, res, next) => {
  let NAME = req.params.Name;
  try {
      let player_info = await players_utils.get_player_info_by_name(NAME, -1);
      let coach_info = await coaches_utils.get_coach_info_by_name(NAME, -1)
      let team_info = await teams_utils.get_team_info_by_name(NAME);

      // let player_info = [];
      if (player_info.length == 0) {
        // throw{ status:400, message:"Sorry! There are no players with this name in this league"};
        player_info = [];
      
      }
      if (coach_info.length == 0) {
        // throw{ status:400, message:"Sorry! There are no coaches with this name in this league"};
        coach_info = [];
      }
      if (team_info.length == 0) {
        //throw{ status:400, message:"Sorry! There are no teams with this name in this league"};
        team_info = [];
      }

      let details = {
        players: player_info,
        coaches: coach_info,
        teams: team_info
      };

      if (player_info.length == 0 && coach_info.length == 0 && team_info.length == 0)
      {
        req.session.lastSearch = {
          query: `/searchByName/${NAME}`,
          result: "No results matched your search query"
        }  
      } else {
        req.session.lastSearch = {
          query: `/searchByName/${NAME}`,
          result: details
        }
      }

    res.status(200).send(details);
  
  } catch (error) {
    next(error);
  }
});


router.get("/searchByNameFilterWithPositionId/:Name/:positionId", async (req, res, next) => {
  let positionID = req.params.positionId;
  let NAME = req.params.Name;
  try {
      let player_info = await players_utils.get_player_info_by_name(NAME, positionID);

      if (player_info.length == 0) {
        // throw{ status:400, message:"Sorry! There are no players with this name in this league"};
        player_info = [];
      }

      if (player_info.length == 0) {
        req.session.lastSearch = {
          query: `/searchByNameFilterWithPositionId/${NAME}/${positionID}`,
          result: "No results matched your search query"
        }
      } else {
        req.session.lastSearch = {
          query: `/searchByNameFilterWithPositionId/${NAME}/${positionID}`,
          result: player_info
        }
      }
 

      res.status(200).send(player_info);
  } catch (error) {
    next(error);
  }
});

router.get("/searchByNameFilterWithTeamName/:Name/:teamName", async (req, res, next) => {
  let teamNAME = req.params.teamName;
  let NAME = req.params.Name;
  try {
      let player_info = await players_utils.get_player_info_by_name(NAME, teamNAME);
      // let team_info = await teams_utils.get_team_info_by_name(NAME);
      let coach_info = await coaches_utils.get_coach_info_by_name(NAME, teamNAME)

      if (player_info.length == 0) {
        // throw{ status:400, message:"Sorry! There are no players with this name in this league"};
        player_info = [];
      }
      if (coach_info.length == 0) {
        // throw{ status:400, message:"Sorry! There are no coaches with this name in this league"};
        coach_info = [];
      }

      let details = {
        players: player_info,
        coaches: coach_info,
      };

      if (player_info.length == 0 && coach_info.length == 0)
      {
        req.session.lastSearch = {
          query: `/searchByNameFilterWithTeamName/${NAME}/${teamNAME}`,
          result: "No results matched your search query"
        }
      } else {
        req.session.lastSearch = {
          query: `/searchByNameFilterWithTeamName/${NAME}/${teamNAME}`,
          result: details
        }
      }
      
      res.status(200).send(details);
  } catch (error) {
    next(error);
  }
});


/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets body with playerId and save this player in the favorites list of the logged-in user
 */
router.post("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const player_id = req.body.playerId;
    if (isNaN(player_id)){
      throw { status: 400, message: "incorrect inputs" };
  }

  const player_details = await players_utils.get_preview_details(player_id);
    if (player_details.length != 0){
      const ans = await users_utils.markAsFavorite("Player",user_id, player_id);
      if(ans == 0){
        res.status(400).send("The Player is already in your favorites");
      }
      else{
        res.status(201).send("The player successfully saved as favorite");
      }
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorite_players = [];
    const player_ids = await users_utils.getFavorite("Player", user_id);
    for (let i = 0; i < player_ids.length; i++){
      const preview_details = await players_utils.get_preview_details(player_ids[i].PlayerID);
      favorite_players.push(preview_details);
    }
    if(favorite_players.length != 0)
    {
      res.status(200).send(favorite_players);
    } else {
      res.status(200).send("There are no players in favorites");
    } 
  }
    catch (error) {
      res.status(400).send("There is no team with this id inputs");
    }
});

/**
 * This path gets body with teamID and save this player in the favorites list of the logged-in user
 */
router.post("/favoriteTeams", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const team_id = req.body.teamId;
    if (isNaN(team_id)){
      throw { status: 400, message: "incorrect inputs" };
  }
    const team_details = await teams_utils.get_team_info(team_id);
    if (team_details.length != 0){
      const ans = await users_utils.markAsFavorite("Team",user_id, team_id);
      if(ans == 0){
        res.status(400).send("The team is already in your favorites");
      }
      else{
        res.status(201).send("The team successfully saved as favorite");
      }
    }
    
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites teams that were saved by the logged-in user
 */
router.get("/favoriteTeams", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorite_teams = [];
    const team_ids = await users_utils.getFavorite("Team", user_id);
    for (let i = 0; i < team_ids.length; i++){
      const team_details = await teams_utils.get_team_info(team_ids[i].TeamID);
      if (team_details.length != 0) {
        favorite_teams.push(team_details);
      }
    }
    if(favorite_teams.length != 0)
    {
      res.status(200).send(favorite_teams);
    } else {
      res.status(200).send("There are no teams in favorites");
    }
  } catch (error) {
    res.status(400).send("There is no team with this id inputs");
  }
});

router.post("/favoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const game_id = req.body.gameId;
    if (isNaN(game_id)){
      throw { status: 400, message: "incorrect inputs" };
  }
    const ans = await users_utils.markAsFavorite("Game",user_id, game_id);
    if(ans == 0){
      res.status(200).send("The game is already in your favrites");
    }
    else{
      res.status(201).send("The game successfully saved as favorite");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/favorites/:table/:id", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let id = req.params.id;
    let table = req.params.table;
    

    if (isNaN(id)){
      throw { status: 400, message: "incorrect inputs" };
  }
    const ans = await users_utils.deletefromfavorites(table, id);
    res.status(201).send(ans);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns the favorites teams that were saved by the logged-in user
 */
router.get("/favoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorite_games = [];
    const games_ids = await users_utils.getFavorite("Game", user_id);
    for (let i = 0; i < games_ids.length; i++){
      const game_details = await users_utils.getFavoritegameDetails(games_ids[i].GameID);
      favorite_games.push(game_details);
    }
    if (favorite_games.length != 0){
      res.status(200).send(favorite_games);
    }
    else{
      res.status(400).send("There are no games in favorites");
    }  
    } catch (error) {
    next(error);
  }
});


module.exports = router;

