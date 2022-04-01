const Sequelize = require("sequelize");
const UsersModel = require("./models/users.js");
const ProductsModel = require("./models/products.js");
const CartModel = require("./models/carts.js");
const TransactionModel = require("./models/transactions.js");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];
const db = {};
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
 
const users = UsersModel(sequelize,Sequelize);
sequelize.sync().then(()=>{
    console.log(`Users table have been created`)
});
const products = ProductsModel(sequelize,Sequelize);
sequelize.sync().then(()=>{
    console.log(`Products table have been created`)
});
const carts = CartModel(sequelize,Sequelize);
sequelize.sync().then(()=>{
    console.log(`Cart table have been created`)
});
const transactions = TransactionModel(sequelize,Sequelize);
sequelize.sync().then(()=>{
    console.log(`Transaction table have been created`)
});
carts.belongsTo(transactions, { foreignKey: "transaction_id", targetKey: "id", as: "transactions" });
transactions.hasMany(carts, { foreignKey: "transaction_id", sourceKey: 'id' });

exports.users = users;
exports.products = products;
exports.carts = carts;
exports.transactions = transactions;