import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

// Define the User attributes
interface UserAttributes {
    id?: number;
    email: string;
    passwordHash: string;
    title: string;
    firstName: string;
    lastName: string;
    role: string;
}

// Define optional attributes for creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Define the User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public passwordHash!: string;
    public title!: string;
    public firstName!: string;
    public lastName!: string;
    public role!: string;
}

// Function to initialize the model
export function UserModel(sequelize: Sequelize): typeof User {
    User.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            passwordHash: { type: DataTypes.STRING, allowNull: false },
            title: { type: DataTypes.STRING, allowNull: false },
            firstName: { type: DataTypes.STRING, allowNull: false },
            lastName: { type: DataTypes.STRING, allowNull: false },
            role: { type: DataTypes.STRING, allowNull: false }
        },
        {
            sequelize,
            tableName: 'users',
            modelName: 'User',
            defaultScope: {
                attributes: { exclude: ['passwordHash'] } // Exclude passwordHash by default
            },
            scopes: {
                withHash: { attributes: { include: ['passwordHash'] } } // Explicitly include passwordHash
            }
        }
    );

    return User;
}

export { User };
