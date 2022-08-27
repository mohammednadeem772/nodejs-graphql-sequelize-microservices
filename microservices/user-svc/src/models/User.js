const DataTypes = require('sequelize/lib/data-types');
const database = require('../config/database');

const hooks = {
	beforeCreate() {},
};

const User = database.define(
	'User',
	{
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		roleId: {
			type: DataTypes.TINYINT,
            allowNull: false,
			references: {
				model: 'ROLES',
				key: 'ROLE_ID'
			}
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
            unique: true,
		},
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
		
	},
	{
		tableName: 'user',
		hooks,
	}
);

User.prototype.toJSON = function () {
	const values = Object.assign({}, this.get());
	return values;
};

module.exports = User;
