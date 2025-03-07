import bcrypt from 'bcryptjs';
import { User } from '../users/user.model';
import { Optional } from 'sequelize';

// Define User parameters for creation and update
interface UserCreateAttributes {
    email: string;
    password: string;
    title: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface UserUpdateAttributes extends Optional<UserCreateAttributes, 'password'> {}

// Exported user service functions
export const userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll(): Promise<User[]> {
    return await User.findAll();
}

async function getById(id: number): Promise<User> {
    return await getUser(id);
}

async function create(params: UserCreateAttributes): Promise<void> {
    // Validate if email is already registered
    if (await User.findOne({ where: { email: params.email } })) {
        throw new Error(`Email "${params.email}" is already registered`);
    }

    // Create user instance
    const user = User.build({
        ...params,
        passwordHash: await bcrypt.hash(params.password, 10) // Hash password properly
    });

    // Save user
    await user.save();
}

async function update(id: number, params: UserUpdateAttributes): Promise<void> {
    const user = await getUser(id);

    // Hash password if provided
    if (params.password) {
        user.passwordHash = await bcrypt.hash(params.password, 10);
        delete params.password; // Remove plain password before updating
    }

    // Update user and save
    Object.assign(user, params);
    await user.save();
}

async function _delete(id: number): Promise<void> {
    const user = await getUser(id);
    await user.destroy();
}

// Helper function to get a user by ID
async function getUser(id: number): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return user;
}
