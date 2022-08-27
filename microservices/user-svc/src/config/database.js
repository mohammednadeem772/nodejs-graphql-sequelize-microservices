const connection = require('./connection');
const { Sequelize, Op } = require('sequelize');

const operatorsAliases = {
	$eq: Op.eq,
	$ne: Op.ne,
	$gte: Op.gte,
	$gt: Op.gt,
	$lte: Op.lte,
	$lt: Op.lt,
	$not: Op.not,
	$in: Op.in,
	$notIn: Op.notIn,
	$is: Op.is,
	$like: Op.like,
	$notLike: Op.notLike,
	$iLike: Op.iLike,
	$notILike: Op.notILike,
	$regexp: Op.regexp,
	$notRegexp: Op.notRegexp,
	$iRegexp: Op.iRegexp,
	$notIRegexp: Op.notIRegexp,
	$between: Op.between,
	$notBetween: Op.notBetween,
	$overlap: Op.overlap,
	$contains: Op.contains,
	$contained: Op.contained,
	$adjacent: Op.adjacent,
	$strictLeft: Op.strictLeft,
	$strictRight: Op.strictRight,
	$noExtendRight: Op.noExtendRight,
	$noExtendLeft: Op.noExtendLeft,
	$and: Op.and,
	$or: Op.or,
	$any: Op.any,
	$all: Op.all,
	$values: Op.values,
	$col: Op.col,
};

const database = new Sequelize({
	database: connection.databaseName,
	host: connection.host,
	username: connection.username,
	password: connection.password,
	port: connection.port,
	operatorsAliases,
	logging: connection.logging
		? (query, obj) => {
			console.log('QUERY::: ', query);
		}
		: false,
	dialect: connection.dialect,
	define: {
		timestamps: true,
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
		deletedAt: 'archivedAt',
		paranoid: true,
		underscored: true,
	},
	pool: {
		max: connection.MAX_CONNECTIONS,
		min: 0,
		idle: 10000,
	},
});

module.exports = database;
