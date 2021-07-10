var express = require("express");
var router = express.Router();
const teams_utils = require("./utils/teams_utils");
const players_utils = require("./utils/players_utils");
const coaches_utils = require("./utils/coaches_utils");


router.get("/teamDetails/:teamId", async (req, res, next) => {
  let teamID = req.params.teamId;
  try {
    
    let team_players = await players_utils.getPlayersByTeam(teamID);
    if (team_players.length == 0)
    {
      team_players = [];
    }
    let team_coach = await coaches_utils.getCoachByTeam(teamID);
    if (team_coach.length == 0)
    {
      team_coach = [];
    }
    let team_games = await teams_utils.getTeamGames(teamID);

    let team_details = {
      players: team_players,
      coach: team_coach,
      games: team_games
    }
    
    res.status(200).send(team_details);
  } catch (error) {
    next(error);
  }
});

router.get("/teamName/:teamId", async (req, res, next) => {
  let teamID = req.params.teamId;
  try {
    let name = await teams_utils.getNameByTeamID(teamID);
    res.status(200).send(name[0].name);
  } catch (error){
    next(error);
  }
});

router.get("/teamLeague/:teamId", async (req, res, next) => {
  const teamID = req.params.teamId;
  try {
    const results = await teams_utils.getTeamLeague(teamID);
    if (results.length == 0)
    {
      res.status(400).send("This team is not exist in that league");
    }
    res.status(200).send(results);
  } catch(error){
    res.status(200).send({league: false});
  }
});

module.exports = router;
