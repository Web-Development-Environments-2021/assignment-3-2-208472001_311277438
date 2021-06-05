var express = require("express");
var router = express.Router();
const teams_utils = require("./utils/teams_utils");
const players_utils = require("./utils/players_utils");
const coaches_utils = require("./utils/coaches_utils");
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
  try {
    
    const team_players_details = await players_utils.getPlayersByTeam(teamID);
    const team_coach = await coaches_utils.getCoachByTeam(teamID);
    const team_games_details = await teams_utils.getTeamDetails(teamID);

    let full_details = extend({}, team_players_details, team_coach, team_games_details);

    res.status(200).send(full_details);
    
  
  } catch (error) {
    next(error);
  }
});


module.exports = router;
