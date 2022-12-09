const repository = require("./repository");

class ProductsRespository extends repository {}

module.exports = new ProductsRespository("products.json");
