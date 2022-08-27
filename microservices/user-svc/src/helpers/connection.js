const mariadb = require('mariadb/callback');
const util = require('util');
var connectiondata = require('../config/constants');

const connectioncommon = mariadb.createConnection({
    host: connectiondata.DEVHOSTLURL, 
    user: connectiondata.DEVUSERNAME, 
    password:connectiondata.DEVUSERPASSWORD, 
    database:connectiondata.DEVUSERDATABASE,
    connectionLimit: 5
});

connectioncommon.connect(err => {
    if (err) {
      console.log("not connected due to error: " + err);
    } else {
      console.log("connected ! connection id is " + connectioncommon.threadId);
    }
  });

connectioncommon.query = util.promisify(connectioncommon.query)
module.exports = connectioncommon;