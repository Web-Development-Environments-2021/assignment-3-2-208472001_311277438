var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
let teamID;


router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_details = [];
  teamID = req.params.teamid;
  try {
    const team_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    //we should keep implementing team page.....
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});


// add the new username
// const team_games = DButils.execQuery(`SELECT * FROM dbo.games WHERE hometeam = '${teamID}'`)[0];

// console.log(team_games);

module.exports = router;
