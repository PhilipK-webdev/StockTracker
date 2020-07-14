const User = require("./User.js")

module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define("Stock", {
        symbol: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        inital_value: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        last_value: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        shares: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    });

    Stock.associate = (models) => {
        Stock.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
            },
        });
    };

    return Stock;
}