const DButils = require("./DButils");


async function markAsFavorite(table, user_id, id) {
  await DButils.execQuery(
    `insert into favorite${table} values ('${user_id}',${id})`
  );
}

async function getFavorite(table, user_id) {
  const ids = await DButils.execQuery(
    `select top 3 ${table}ID from favorite${table}s where userID=${user_id}`
  );
  return ids;
}

async function getFavoritegameDetails(game_id) {
  const game_details = await DButils.execQuery(`select * from dbo.Games where gameID='${game_id}'`
  );
  return game_details;
}


exports.markAsFavorite = markAsFavorite;
exports.getFavorite = getFavorite;
