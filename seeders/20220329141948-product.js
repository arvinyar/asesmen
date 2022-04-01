'use strict';
const fs = require('fs');
const path = require('path');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8');
    const searchForm = JSON.parse(data);
 
    return queryInterface.bulkInsert('products', searchForm);
  },

  down: queryInterface => queryInterface.bulkDelete('products', null, {}),
};