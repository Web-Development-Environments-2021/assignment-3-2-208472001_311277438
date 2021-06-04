var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

router.get("/homePage/:playerId", async (req, res, next) => {
  let player_details = [];
  let playerID = req.params.playerId;
  try {
    const preview_details = await players_utils.get_preview_details(playerID);
    const extra_details = await players_utils.get_extra_details(playerID);
    let full_details = extend({}, preview_details, extra_details);
    player_details.push(full_details);

    res.send(player_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
