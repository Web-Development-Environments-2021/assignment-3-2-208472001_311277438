const axios = require("axios");
const DButils = require("./DButils");

async function getTeamGames(teamID) {
    let team_details = [];
    // const players_details = await players_utils.getPlayersByTeam(teamID);
    // team_details.push(players_details);
      
    const past_home_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE hometeamID = ${teamID} AND homeGoal IS NOT NULL`);
    const past_away_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE awayteamID = ${teamID} AND awayGoal IS NOT NULL`);
    const future_home_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE hometeamID = ${teamID} AND homeGoal IS NULL`);
    const future_away_team_games = await DButils.execQuery(`SELECT * FROM dbo.games WHERE awayteamID = ${teamID} AND awayGoal IS NULL`);
    team_details.push(past_home_team_games);
    team_details.push(past_away_team_games);
    team_details.push(future_home_team_games);
    team_details.push(future_away_team_games);
  
    return team_details;

  }

  async function get_team_info(teamID) {
    const team = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/teams/${teamID}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
  
    return {
      team_id: team.data.data.id,
      team_name: team.data.data.name,
      team_logo: team.data.data.logo_path
    };

  }

  async function get_team_info_by_name(TEAM_NAME) {
    const teams = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/teams/search/${TEAM_NAME}`,
      {
        params: {
          include: "league",
          api_token: process.env.api_token,
        },
      }
    );

    teams_ids_list = [];
    for (let i=0; i<teams.data.data.length; i++)
    {
      try 
      {
        if (teams.data.data[i].league.data.id == 271)
        {
          teams_ids_list.push(teams.data.data[i].id)
        }
      } catch (error) {
        continue;
      }

    }

    let relevant_teams = await Promise.all(teams_ids_list);

    teams_details = [];
    for (let i=0; i< relevant_teams.length; i++)
    {
        const teams_info = await get_team_info(relevant_teams[i]);
        teams_details.push(teams_info);
    }


  return teams_details;
  
  }

  exports.getTeamGames = getTeamGames;
  exports.get_team_info = get_team_info;
  exports.get_team_info_by_name = get_team_info_by_name;

