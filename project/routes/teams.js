var express = require("express");
const { VarChar } = require("mssql");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
let teamID;

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_details = [];
  teamID = req.params.teamId;
  try {
    const players_details = await players_utils.getPlayersByTeam(teamID);
    team_details.push(players_details);
    //we should keep implementing team page.....

    past_home_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE hometeamID = ${teamID} AND score IS NOT NULL`);
    past_away_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE awayteamID = ${teamID} AND score IS NOT NULL`);
    future_home_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE hometeamID = ${teamID} AND score IS NULL`);
    future_away_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE awayteamID = ${teamID} AND score IS NULL`);
    team_details.push(past_home_team_games);
    team_details.push(past_away_team_games);
    team_details.push(future_home_team_games);
    team_details.push(future_away_team_games);

    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
