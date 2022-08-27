const globalConstants = require('./constants');

module.exports = {
	databaseName: process.env.DB_NAME || globalConstants.DEVUSERDATABASE,
	username: process.env.DB_USER || globalConstants.DEVUSERNAME,
	password: process.env.DB_PASS || globalConstants.DEVUSERPASSWORD,
	host: process.env.DB_HOST || globalConstants.DEVHOSTLURL || 'localhost',
	dialect: process.env.DB_DIALECT || 'mariadb',
	port: process.env.PORT || globalConstants.DEVCONNECTIONPORT || 3307,
	MAX_CONNECTIONS: 50000,
	logging: true,
};
