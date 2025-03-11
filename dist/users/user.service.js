"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
exports.userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};
async function getAll() {
    const userRepository = (0, typeorm_1.getRepository)(user_model_1.User);
    return await userRepository.find();
}
async function getById(id) {
    return await getUser(id);
}
async function create(params) {
    const userRepository = (0, typeorm_1.getRepository)(user_model_1.User);
    if (await userRepository.findOne({ email: params.email })) {
        throw new Error(`Email "${params.email}" is already registered`);
    }
    const user = userRepository.create({
        ...params,
        passwordHash: await bcryptjs_1.default.hash(params.password, 10)
    });
    await userRepository.save(user);
}
async function update(id, params) {
    const userRepository = (0, typeorm_1.getRepository)(user_model_1.User);
    const user = await getUser(id);
    if (params.password) {
        user.passwordHash = await bcryptjs_1.default.hash(params.password, 10);
        delete params.password;
    }
    Object.assign(user, params);
    await userRepository.save(user);
}
async function _delete(id) {
    const userRepository = (0, typeorm_1.getRepository)(user_model_1.User);
    const user = await getUser(id);
    await userRepository.remove(user);
}
async function getUser(id) {
    const userRepository = (0, typeorm_1.getRepository)(user_model_1.User);
    const user = await userRepository.findOne(id);
    if (!user)
        throw new Error('User not found');
    return user;
}
