const DButils = require("./DButils");

async function markAsFavorite(table, user_id, id) {
  await DButils.execQuery(
    `insert into ${table} values ('${user_id}',${id})`
  );
}

async function getFavorite(table, user_id) {
  const player_ids = await DButils.execQuery(
    `select top 3 playerid from ${table} where userid='${user_id}'`
  );
  return player_ids;
}

async function getFavoritegameDetails(game_id) {
  const game_details = await DButils.execQuery(`select * from dbo.Games where gameid='${game_id}'`
  );
  return game_details;
}


exports.markAsFavorite = markAsFavorite;
exports.getFavorite = getFavorite;
exports.getFavoritegameDetails= getFavoritegameDetails;
