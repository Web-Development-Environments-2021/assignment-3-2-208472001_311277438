var express = require("express");
var router = express.Router();
const teams_utils = require("./utils/teams_utils");
let teamID;

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  teamID = req.params.teamId;
  try {
    const a = await teams_utils.getTeamDetails(teamID);
    res.status(200).send(a);
  
  } catch (error) {
    next(error);
  }
});

module.exports = router;
