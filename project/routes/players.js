var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
const coaches_utils = require("./utils/coaches_utils");
// const session = require("client-sessions");
// const bcrypt = require("bcryptjs");

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

// router.get("/homePageByName/:playerName", async (req, res, next) => {
//     let player_details = [];
//     let playerNAME = req.params.playerName;
//     try {
//         const players_ids_list = await players_utils.get_homePage_by_player_name(playerNAME);
//         for (let i=0; i<players_ids_list.length; i++)
//         {
//             const preview_details = await players_utils.get_preview_details(players_ids_list[i]);
//             const extra_details = await players_utils.get_extra_details(players_ids_list[i]);
//             let full_details = extend({}, preview_details, extra_details);
//             player_details.push(full_details);
//         }
  
//       res.send(player_details);
//     } catch (error) {
//       next(error);
//     }
//   });

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

        // session ({
        //     query: `/searchByName/${NAME}`,
        //     results: details,
        // })

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

        res.send(details);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
