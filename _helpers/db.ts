import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from '../users/user.model';
import config from '../config.json';

export async function initializeDatabase(): Promise<void> {
    const { host, port, user, password, database } = config.database;

    await createConnection({
        type: 'mysql',
        host,
        port,
        username: user,
        password,
        database,
        entities: [User],
        synchronize: true,
        logging: false
    });

    console.log('✅ Database initialized successfully.');
}
