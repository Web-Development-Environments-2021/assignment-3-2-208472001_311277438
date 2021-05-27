var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
let teamID;

router.get("/homePage/:playerId", async (req, res, next) => {
  let player_details = [];
  playerID = req.params.playerId;
  try {
    const preview_details = await players_utils.get_preview_details(playerID);
    player_details.push(preview_details);
    const extra_details = await players_utils.get_extra_details(playerID);
    player_details.push(extra_details);

    res.send(player_details);
  } catch (error) {
    next(error);
  }
});

router.get("/search/:playerName", async (req, res, next) => {
    playerNAME = req.params.playerName;
    try {
        const player_info = await players_utils.get_player_info_by_name(playerNAME);
        res.send(player_info);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
