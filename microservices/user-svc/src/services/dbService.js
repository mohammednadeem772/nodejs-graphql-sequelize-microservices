const database = require('../config/database');

const dbService = () => {
	const authenticateDB = () => database.authenticate();

	const syncDB = () => database.sync();

	const associateModels = () => {
		Object.keys(database.models).forEach((modelName) => {
			if (database.models[modelName].associate) {
				database.models[modelName].associate(database.models);
			}
		});
	};

	const successfulDBStart = () =>
		console.info(
			'connection to the database has been established successfully'
		);

	const errorDBStart = (err) =>
		console.info('unable to connect to the database:', err);

	const startDev = async () => {
		try {
			await authenticateDB();

			// await syncDB();
			await associateModels();
			successfulDBStart();
		} catch (err) {
			return errorDBStart(err);
		}
	};

	return {
		startDev,
	};
};

module.exports = dbService;
