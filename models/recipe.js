const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Recipe = sequelize.define(
    "Recipe",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      making_time: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      serves: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      ingredients: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: true },
      },
    },
    {
      tableName: "recipes",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Recipe;
};
