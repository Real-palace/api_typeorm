import 'reflect-metadata';
import config from '../config.json';
import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import { UserModel, User } from '../users/user.model';

interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

// Define the database object
const db: { sequelize?: Sequelize; User?: typeof User } = {};

export default db;

initialize();

async function initialize(): Promise<void> {
    try {
        // Extract database config
        const databaseConfig: DatabaseConfig = config.database as DatabaseConfig;

        if (!databaseConfig) {
            throw new Error("Database configuration is missing in config.json");
        }

        const { host, port, user, password, database } = databaseConfig;

        // Ensure database exists
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();

        // Connect to MySQL with Sequelize
        const sequelize = new Sequelize(database, user, password, { 
            host,
            dialect: 'mysql', 
            logging: false
        });

        // Initialize models
        db.sequelize = sequelize;
        db.User = UserModel(sequelize);

        // Ensure model is properly initialized
        console.log("Initialized User model:", db.User);

        // Sync models with database
        await sequelize.sync({ alter: true });

        console.log('✅ Database initialized successfully.');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
    }
}
