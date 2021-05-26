var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const coaches_utils = require("./utils/coaches_utils");

router.get("/homePage/:coachId", async (req, res, next) => {
  let coach_details = [];
  coachID = req.params.coachId;
  try {
    const preview_details = await coaches_utils.get_preview_details(coachID);
    coach_details.push(preview_details);
    const extra_details = await coaches_utils.get_extra_details(coachID);
    coach_details.push(extra_details);

    res.send(coach_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
