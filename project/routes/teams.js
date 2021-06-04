var express = require("express");
var router = express.Router();
const teams_utils = require("./utils/teams_utils");
const players_utils = require("./utils/players_utils");
let teamID;

function extend(target) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function (source) {
      for (var prop in source) {
          target[prop] = source[prop];
      }
  });
  return target;
}

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  teamID = req.params.teamId;
  team_details = [];
  try {
    const team_players_details = await players_utils.getPlayersByTeam(teamID);
    const team_games_details = await teams_utils.getTeamDetails(teamID);

    let full_details = extend({}, team_games_details, team_players_details);
    team_details.push(full_details);

    res.status(200).send(team_details);
    
  
  } catch (error) {
    next(error);
  }
});


module.exports = router;
