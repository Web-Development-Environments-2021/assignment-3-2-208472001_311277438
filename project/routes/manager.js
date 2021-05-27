var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");


router.use(async function (req, res, next) {
    if (req.session && req.session.user_id) {
        DButils.execQuery("SELECT user_id FROM users")
            .then((users) => {
                if (users.find((x) => x.user_id === req.session.user_id)) {
                    req.user_id = req.session.user_id;
                    next();
                }
            })
            .catch((err) => next(err));
    } else {
        res.sendStatus(401);
    }
});


router.post("/addGame", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (user_id != 1) {
            res.status(403).send("The user doesnt have access to add game")
        }
        else {
            await DButils.execQuery(
                `INSERT INTO dbo.games (gameID, gamedate, gametime, hometeamID, awayteamID, field, score) VALUES ('${req.body.gameID}', '${req.body.gamedate}','${req.body.gametime}', '${req.body.hometeamID}','${req.body.awayteamID}','${req.body.field}','${req.body.score}')`
            );
            res.status(201).send("game has been added");
        }
    } catch (error) {
        next(error);
    }
});


router.put("/addScore", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (user_id != 1) {
            res.status(403).send("The user doesnt have access to add game")
        }
        else {
            const gameid = req.body.gameId;
            const score = req.body.score;

            await DButils.execQuery(
                `update dbo.games set score = '${score}' where gameID = '${gameid}'`
            );
            res.status(201).send("score has been added to game");
        }
    } catch (error) {
        next(error);
    }
});


router.post("/addEvent", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (user_id != 1) {
            res.status(403).send("The user doesnt have access to add game")
        }
        else {
            const user_id = req.session.user_id;
            await DButils.execQuery(
                `INSERT INTO dbo.events (gameID, eventdate, eventtime, eventminute, dataevent, playerID) VALUES ('${req.body.gameID}', '${req.body.eventdate}','${req.body.eventtime}', '${req.body.eventminute}','${req.body.dataevent}','${req.body.field}','${req.body.playerID}')`
            );
            res.status(201).send("event has been added");
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
