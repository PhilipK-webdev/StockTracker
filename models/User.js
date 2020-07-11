const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define("User", {
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validtae: {
                [Op.iRegexp]: '^[h|a|t]',
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    User.associate = (models) => {
        User.hasMany(models.Stock, {
            onDelete: "cascade",
        });
    };

    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };
    User.prototype.validEmail = function (email) {
        return bcrypt.compareSync(email, this.email);
    };

    User.addHook("beforeCreate", (user) => {
        user.password = bcrypt.hashSync(
            user.password,
            bcrypt.genSaltSync(10),
            null
        );
    });

    return User;
};
