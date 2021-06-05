const DButils = require("./DButils");


async function markAsFavorite(table, user_id, id) {
  if (table == "Game"){
    const row = await DButils.execQuery(
      `SELECT gameid, homegoal FROM dbo.${table}s WHERE gameID = ${id}`
    );

    if (typeof row[0] === 'undefined'){
      throw { status: 201, message: `there is no ${table} with this id` };
    }
    if (typeof row[0].homegoal != null){
      throw { status: 201, message: `there game already played` };
    }
  }

  const index = await DButils.execQuery(
  `select ${table}id from dbo.favorite${table}s where ${table}id = ${id} and userid = ${user_id}`
  );

  if (typeof index[0] != 'undefined'){
    throw { status: 201, message: `the ${table} already in user ${user_id} favorites` };
  }
  
  await DButils.execQuery(
    `insert into dbo.favorite${table}s values ('${user_id}','${id}')`
  );
}

async function getFavorite(table, user_id) {
  const ids = await DButils.execQuery(
    `select top 3 ${table}ID from dbo.favorite${table}s where userID=${user_id}`
  );
  return ids;
}


exports.markAsFavorite = markAsFavorite;
exports.getFavorite = getFavorite;
