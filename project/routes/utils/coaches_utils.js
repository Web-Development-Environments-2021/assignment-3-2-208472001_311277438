const axios = require("axios");

async function get_preview_details(COACH_ID) {
  const coach = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/coaches/${COACH_ID}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );

  const coach_team = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/teams/${coach.data.data.team_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );

  return {
    full_name: coach.data.data.fullname,
    team_name: coach_team.data.data.name,
    image: coach.data.data.image_path,
  };
}

async function get_extra_details(COACH_ID) {
  const coach = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/coaches/${COACH_ID}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );

  return {
    common_name: coach.data.data.common_name,
    nationality: coach.data.data.nationality,
    birthdate: coach.data.data.birthdate,
    birthcountry: coach.data.data.birthcountry,
  };
}

exports.get_preview_details = get_preview_details;
exports.get_extra_details = get_extra_details;