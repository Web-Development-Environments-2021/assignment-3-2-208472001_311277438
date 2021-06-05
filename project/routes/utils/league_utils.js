const axios = require("axios");
const DButils = require("./DButils");
const LEAGUE_ID = 271;

async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  let stage_name = "";
  if (league.data.data.current_stage_id != null){
    const stage = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
    stage_name = stage.data.data.name;
  }
  else{
    stage_name = "2nd Phase";
  }
  const next_game = await DButils.execQuery(`select  TOP 1 * from dbo.games where homeGoal is null ORDER BY gamedate asc`);
  


  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage_name,
    nextgame: next_game
  };
}

exports.getLeagueDetails = getLeagueDetails;


