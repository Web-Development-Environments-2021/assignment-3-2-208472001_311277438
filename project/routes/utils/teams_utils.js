const DButils = require("./DButils");
const players_utils = require("./players_utils");

async function getTeamDetails(teamID) {
    let team_details = [];
    // const players_details = await players_utils.getPlayersByTeam(teamID);
    // team_details.push(players_details);
      
    const past_home_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE hometeamID = ${teamID} AND score IS NOT NULL`);
    const past_away_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE awayteamID = ${teamID} AND score IS NOT NULL`);
    const future_home_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE hometeamID = ${teamID} AND score IS NULL`);
    const future_away_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE awayteamID = ${teamID} AND score IS NULL`);
    team_details.push(past_home_team_games);
    team_details.push(past_away_team_games);
    team_details.push(future_home_team_games);
    team_details.push(future_away_team_games);
  
    // return team_details;

    return {
      team_details: team_details

    };
  }

  exports.getTeamDetails = getTeamDetails;
