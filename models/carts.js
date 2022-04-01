'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.transactions, {foreignKey: "transaction_id", targetKey: "id",as:"transactions"});
    }
  };
  carts.init({
    product_id: DataTypes.STRING,
    total_items:DataTypes.INTEGER,
    unit_price: DataTypes.INTEGER,
    total_prices:DataTypes.INTEGER,
    transaction_id:DataTypes.INTEGER,
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
    modelName: 'carts',
  });
  

  return carts;
};