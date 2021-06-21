const DButils = require("./DButils");


async function markAsFavorite(table, user_id, id) {
  if (table == "Game"){
    const row = await DButils.execQuery(
      `SELECT gameid, homegoal FROM dbo.${table}s WHERE gameID = ${id}`
    );

    if (typeof row[0] === 'undefined'){
      //  return `There is no ${table} with this id`;
      return 0;
    }
    if (row[0].homegoal != null){
      // return `This game already played`;
      return 0;
    }
  }

  const index = await DButils.execQuery(
  `select ${table}id from dbo.favorite${table}s where ${table}id = ${id} and userid = ${user_id}`
  );

  if (typeof index[0] != 'undefined'){
    // return `The ${table} already in user ${user_id} favorites`;
    return 0
  }
  
  await DButils.execQuery(
    `insert into dbo.favorite${table}s values ('${user_id}','${id}')`
  );
  // return "The " + table + " successfully saved as favorite";
  return 1;
}

async function getFavorite(table, user_id) {
  const ids = await DButils.execQuery(
    `select top 3 ${table}ID from dbo.favorite${table}s where userID=${user_id}`
  );
  return ids;
}

async function getFavoritegameDetails(gameID){
  const game = await DButils.execQuery(
    `select top 3 gameid, gamedate, gametime, hometeamID, awayteamID, field from dbo.games where gameID=${gameID}`
  );
  // const events = await DButils.execQuery(
  //   `select * from dbo.events where gameID=${gameID}`
  // );

  return {
    gamedetails: game,
    // eventsdetails: events
  };
}

async function deletefromfavorites(table, id){
  const mount = await DButils.execQuery(
    `select count(*) as num from dbo.favorite${table}s`
  );

  await DButils.execQuery(
    `delete from dbo.favorite${table}s where gameid=${id}`
  );

  const mount2 = await DButils.execQuery(
    `select count(*) as num from dbo.favorite${table}s`
  );
  
  if(mount2[0].num - mount[0].num != 0)
    return "Succeeded";
  return "fail";
}

exports.deletefromfavorites = deletefromfavorites;
exports.getFavoritegameDetails = getFavoritegameDetails;
exports.markAsFavorite = markAsFavorite;
exports.getFavorite = getFavorite;
