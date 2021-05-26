var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");

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
    console.log("----------------------------------");
    console.log(user_id);
    console.log(player_id);
    await users_utils.markAsFavorite("favoritePlayers",user_id, player_id);
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
    const player_ids = await users_utils.getFavorite("favoritePlayers", user_id);
    for (let i = 0; i < player_ids.length; i++){
      const extra_details = await players_utils.get_extra_details(player_ids[i].playerid);
      favorite_players.push(extra_details);
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
    const team_id = req.body.teamId;
    await users_utils.markAsFavorite("favoriteTeams",user_id, team_id);
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
    const team_ids = await users_utils.getFavorite("favoriteTeams", user_id);
    for (let i = 0; i < team_ids.length; i++){
      const extra_details = await players_utils.get_extra_details(team_ids[i].teamid);
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
    await users_utils.markAsFavorite("favoriteGames",user_id, game_id);
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
    const games_ids = await users_utils.getFavorite("favoriteGames", user_id);
    for (let i = 0; i < games_ids.length; i++){
      const extra_details = await users_utils.getFavoritegameDetails(games_ids[i].gameid);
      favorite_games.push(extra_details);
    }
    res.status(200).send(favorite_games);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
