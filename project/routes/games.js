var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");

router.post("/addGame", async (req, res, next) => {
  try{
    await DButils.execQuery(
      `INSERT INTO dbo.games (gameID, gamedate, gametime, hometeam, awayteam, field, score) VALUES ('${req.body.gameID}', '${req.body.gamedate}','${req.body.gametime}', '${req.body.hometeam}','${req.body.awayteam}','${req.body.field}','${req.body.score}')`
    );
  res.status(201).send("game has been added");
} catch (error) {
  next(error);
}
});

router.post("/addEvent", async (req, res, next) => {
    try{
      await DButils.execQuery(
        `INSERT INTO dbo.events (gameID, eventdate, eventtime, eventminute, dataevent, player) VALUES ('${req.body.gameID}', '${req.body.eventdate}','${req.body.eventtime}', '${req.body.eventminute}','${req.body.dataevent}','${req.body.field}','${req.body.player}')`
      );
    res.status(201).send("event has been added");
  } catch (error) {
    next(error);
  }
  });

module.exports = router;

