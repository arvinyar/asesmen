const model = require("../../../sequelize.js");
const users = model.users;
const products = model.products;
const carts = model.carts;
const transactions = model.transactions;

module.exports = {
    DatabaseMiddleware: (req, res, next) => {
        req.users = users;
        req.products = products;
        req.carts = carts;
        req.transactions = transactions;
        next()
    }
};
