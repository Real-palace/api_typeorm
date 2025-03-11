"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const validate_request_1 = __importDefault(require("../_middleware/validate-request"));
const role_1 = __importDefault(require("../_helpers/role"));
const user_service_1 = require("./user.service");
const router = express_1.default.Router();
// Routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
// Route functions
async function getAll(req, res, next) {
    try {
        const users = await user_service_1.userService.getAll();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
}
async function getById(req, res, next) {
    try {
        const user = await user_service_1.userService.getById(parseInt(req.params.id));
        res.json(user);
    }
    catch (error) {
        next(error);
    }
}
async function create(req, res, next) {
    try {
        await user_service_1.userService.create(req.body);
        res.json({ message: 'User created' });
    }
    catch (error) {
        next(error);
    }
}
async function update(req, res, next) {
    try {
        await user_service_1.userService.update(parseInt(req.params.id), req.body);
        res.json({ message: 'User updated' });
    }
    catch (error) {
        next(error);
    }
}
async function _delete(req, res, next) {
    try {
        await user_service_1.userService.delete(parseInt(req.params.id));
        res.json({ message: 'User deleted' });
    }
    catch (error) {
        next(error);
    }
}
// Schema functions
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        role: joi_1.default.string().valid(role_1.default.Admin, role_1.default.User).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required()
    });
    (0, validate_request_1.default)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().empty(''),
        firstName: joi_1.default.string().empty(''),
        lastName: joi_1.default.string().empty(''),
        role: joi_1.default.string().valid(role_1.default.Admin, role_1.default.User).empty(''),
        email: joi_1.default.string().email().empty(''),
        password: joi_1.default.string().min(6).empty(''),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).empty('')
    }).with('password', 'confirmPassword');
    (0, validate_request_1.default)(req, next, schema);
}
