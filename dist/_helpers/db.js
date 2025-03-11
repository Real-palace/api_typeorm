"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_model_1 = require("../users/user.model");
const config_json_1 = __importDefault(require("../config.json"));
async function initializeDatabase() {
    const { host, port, user, password, database } = config_json_1.default.database;
    await (0, typeorm_1.createConnection)({
        type: 'mysql',
        host,
        port,
        username: user,
        password,
        database,
        entities: [user_model_1.User],
        synchronize: true,
        logging: false
    });
    console.log('✅ Database initialized successfully.');
}
