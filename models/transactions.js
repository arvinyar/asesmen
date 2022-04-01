'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.carts, {foreignKey: "transaction_id", sourceKey:'id',as:"carts"});
    }
  };
  transactions.init({
    user_id: DataTypes.INTEGER,
    status:DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      //field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate : DataTypes.NOW,
      //field: 'updated_at',
    },
  }, {
    sequelize,
    modelName: 'transactions',
  });
  

  return transactions;
};