const knex = require('knex')(require('../knexfile').development);

const{attachPaginate} = require('knex-paginate');
attachPaginate();

module.exports = knex;