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

    Stock.prototype.deleteStock = function (userName, stockSymbol) {
        Stock.destroy({
            where: {
                symbol: stockSymbol
            },
            include: [{
                model: User,
                where: { username: userName }
            }]
        })
    }

    Stock.prototype.addStock = async function (userName, stockSymbol, cpName, initValue, lastValue) {
        const relatedUser = await User.findOne({ where: { username: userName } })
        Stock.create({
            symbol: stockSymbol,
            company_name: cpName,
            initial_value: initValue,
            last_value: lastValue,
            shares: 0,
            user: relatedUser
        }, { include: [User] })
    }
    return Stock;
}