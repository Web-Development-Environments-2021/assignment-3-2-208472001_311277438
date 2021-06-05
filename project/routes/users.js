var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
const coaches_utils = require("./utils/coaches_utils");


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
    console.log(user_id);
    const player_id = req.body.playerId;
    await users_utils.markAsFavorite("Players",user_id, player_id);
    res.status(201).send("The player successfully saved as favorite");
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
      const preview_details = await players_utils.get_preview_details(player_ids[i].playerid);
      favorite_players.push(preview_details);
    }
    res.status(200).send(favorite_players);
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets body with teamID and save this player in the favorites list of the logged-in user
 */
router.post("/favoriteTeams", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const team_id = req.body.teamsId;
    await users_utils.markAsFavorite("Teams",user_id, team_id);
    res.status(201).send("The team successfully saved as favorite");
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
      const extra_details = await teams_utils.getTeamDetails(team_ids[i].teamid);
      favorite_teams.push(extra_details);
    }
    res.status(200).send(favorite_teams);
  } catch (error) {
    next(error);
  }
});

router.post("/favoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const game_id = req.body.gameId;
    await users_utils.markAsFavorite("Games",user_id, game_id);
    res.status(201).send("The game successfully saved as favorite");
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
      const extra_details = await users_utils.getFavoritegameDetails(games_ids[i].gameid);
      favorite_games.push(extra_details);
    }
    res.status(200).send(favorite_games);
  } catch (error) {
    next(error);
  }
});

router.get("/lastSearch", async (req, res, next) => {
  try {
    if (req.session.lastSearch == null) {
      res.status(200).send("You have not searched for anything yet!");
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
  let details = [];
  try {
      const player_info = await players_utils.get_player_info_by_name(NAME, -1);
      const team_info = await teams_utils.get_team_info_by_name(NAME);
      const coach_info = await coaches_utils.get_coach_info_by_name(NAME, -1)
      details.push(player_info);
      details.push(team_info);
      details.push(coach_info);

      req.session.lastSearch = {
        query: `/searchByName/${NAME}`,
        result: details
      }

    res.status(200).send(details);
  
  } catch (error) {
    next(error);
  }
});


router.get("/searchByNameFilterWithPositionId/:Name/:positionId", async (req, res, next) => {
  let positionID = req.params.positionId;
  let NAME = req.params.Name;
  let details = [];
  try {
      const player_info = await players_utils.get_player_info_by_name(NAME, positionID);
      const team_info = await teams_utils.get_team_info_by_name(NAME);
      const coach_info = await coaches_utils.get_coach_info_by_name(NAME, -1)
      details.push(player_info);
      details.push(team_info);
      details.push(coach_info);

      req.session.lastSearch = {
        query: `/searchByNameFilterWithPositionId/${NAME}/${positionID}`,
        result: details
      }

      res.send(details);
  } catch (error) {
    next(error);
  }
});

router.get("/searchByNameFilterWithTeamName/:Name/:teamName", async (req, res, next) => {
  let teamNAME = req.params.teamName;
  let NAME = req.params.Name;
  let details = [];
  try {
      const player_info = await players_utils.get_player_info_by_name(NAME, teamNAME);
      const team_info = await teams_utils.get_team_info_by_name(NAME);
      const coach_info = await coaches_utils.get_coach_info_by_name(NAME, teamNAME)
      details.push(player_info);
      details.push(team_info);
      details.push(coach_info);

      req.session.lastSearch = {
        query: `/searchByNameFilterWithTeamName/${NAME}/${teamNAME}`,
        result: details
      }

      res.send(details);
  } catch (error) {
    next(error);
  }
});



module.exports = router;

