import bcrypt from 'bcryptjs';
import { getRepository } from 'typeorm';
import { User } from './user.model';

interface UserCreateAttributes {
    email: string;
    password: string;
    title: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface UserUpdateAttributes extends Partial<UserCreateAttributes> {}

export const userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

/**
 * ✅ Get all users
 */
async function getAll(): Promise<User[]> {
    const userRepository = getRepository(User);
    return await userRepository.find();
}

/**
 * ✅ Get user by ID
 */
async function getById(id: number): Promise<User> {
    return await getUser(id);
}

/**
 * ✅ Create a new user
 */
async function create(params: UserCreateAttributes): Promise<void> {
    const userRepository = getRepository(User);

    // Check if email already exists
    const existingUser = await userRepository.findOne({
        where: { email: params.email }
    });

    if (existingUser) {
        throw new Error(`Email "${params.email}" is already registered`);
    }

    // Hash the password before saving the user
    const passwordHash = await bcrypt.hash(params.password, 10);

    // Create and save the user
    const user = userRepository.create({
        ...params,
        passwordHash: passwordHash
    });

    await userRepository.save(user);
}

/**
 * ✅ Update user
 */
async function update(id: number, params: UserUpdateAttributes): Promise<void> {
    const userRepository = getRepository(User);

    // Find the user first
    const user = await getUser(id);

    // If a new password is provided, hash it
    if (params.password) {
        user.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // Update the user with new data
    Object.assign(user, params);
    await userRepository.save(user);
}

/**
 * ✅ Delete user
 */
async function _delete(id: number): Promise<void> {
    const userRepository = getRepository(User);

    // Find the user first
    const user = await getUser(id);
    await userRepository.remove(user);
}

/**
 * ✅ Get user by ID with error handling
 */
async function getUser(id: number): Promise<User> {
    const userRepository = getRepository(User);

    console.log(`Fetching user with id: ${id}`); // Added logging for debugging

    const user = await userRepository.findOne({
        where: { id: id }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
}
