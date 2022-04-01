const responseHelper = require('../../helper/response.helper');
const { Op } = require("sequelize");
const { stringify } = require('uuid');

class ProductsController {
    async find(req, res, next) {
        const products = req.products;
        let { product_name, price_min, price_max, promo_max, promo_min, quantity_max, quantity_min } = req.body
        price_min = (price_min == null || price_min == undefined || !Number.isInteger(price_min)) ? -1 : price_min 
        price_max = (price_max == null || price_max == undefined || !Number.isInteger(price_max)) ? -1 : price_max
        promo_min = (promo_min == null || promo_min == undefined || !Number.isInteger(promo_min)) ? -1 : promo_min 
        promo_max = (promo_max == null || promo_max == undefined || !Number.isInteger(promo_max)) ? -1 : promo_max
        quantity_min = (quantity_min == null || quantity_min == undefined || !Number.isInteger(quantity_min)) ? -1 : quantity_min 
        quantity_max = (quantity_max == null || quantity_max == undefined || !Number.isInteger(quantity_max)) ? -1 : quantity_max
        let query_price
        let query_promo
        let query_quantity
        let query_name
        let query
        if(product_name != undefined){
            query_name = {[Op.like]: '%'.concat(product_name,'%')}
        }else{
            query_name = {[Op.not]: null}
        }
        

        if(price_max == 0 && price_min == 0){
            query_price = {[Op.eq]: 0}
        }else if((price_max == -1 || price_max == 0) && price_min > 0){
            query_price = {[Op.gte]: price_min}
        }else if(price_max > 0 && price_min == -1 || price_min == 0){
            query_price = {[Op.between]: [price_min,price_max]}
        }else if(price_max < price_min && price_max >= 0 && price_min >= 0){
            query_price = {[Op.between]: [price_max,price_min]}
        }else if(price_max >= price_min && price_max >= 0 && price_min >= 0){
            query_price = {[Op.between]: [price_min,price_max]}
        }else{
            query_price = {[Op.not]: null}
        }

        if(promo_max == 0 && promo_min == 0){
            query_promo = {[Op.eq]: 0}
        }else if((promo_max == 0 || promo_max == -1) && promo_min > 0){
            query_promo = {[Op.gte]: promo_min}
        }else if(promo_max > 0 && (promo_min == 0 || promo_min == -1)){
            query_promo = {[Op.between]: [promo_min,promo_max]}
        }else if(promo_max < promo_min && promo_max >= 0 && promo_min >= 0){
            query_promo = {[Op.between]: [promo_max,promo_min]}
        }else if(promo_max >= promo_min && promo_max >= 0 && promo_min >= 0){
            query_promo = {[Op.between]: [promo_min,promo_max]}
        }else{
            query_promo = {[Op.not]: null}
        }

        if(quantity_max == 0 && quantity_min == 0){
            query_quantity = {[Op.eq]: 0}
        }else if((quantity_max == 0 || quantity_max == -1) && quantity_min > 0){
            query_quantity = {[Op.gte]: quantity_min}
        }else if(quantity_max > 0 && (quantity_min == 0 || quantity_min == -1)){
            query_quantity = {[Op.between]: [quantity_min,quantity_max]}
        }else if(quantity_max < quantity_min && quantity_max >= 0 && quantity_min >= 0){
            query_quantity = {[Op.between]: [quantity_max,quantity_min]}
        }else if(quantity_max >= quantity_min && quantity_max >= 0 && quantity_min >= 0){
            query_quantity = {[Op.between]: [quantity_min,quantity_max]}
        }else{
            query_quantity = {[Op.not]: null}
        }

        query={
            name:query_name,
            price:query_price,
            promo:query_promo,
            quantity:query_quantity
        }

        /*
        if (product_name == undefined || product_name == "" ||
            !Number.isInteger(price_min) || !Number.isInteger(price_max) ||
            !Number.isInteger(promo_max) || !Number.isInteger(promo_min) ||
            !Number.isInteger(quantity_max) || !Number.isInteger(quantity_min) ||
            price_max < price_min || promo_max < promo_min || quantity_max < quantity_min
        ) {
            req.businessLogic = await responseHelper({
                "code": 422,
                "api": "Checkout",
                "state": "Bad Request",
            })
            next()
            return
        }
        */
        
        await products.findAll(
            {
                where:query
            }
        ).then(
            async data => {
                if(data.length>0){
                    req.businessLogic = await responseHelper({
                        "code": 200,
                        "api": "Product",
                        "state": "Fetch Product Success",
                        "data": data,
                    })
                    next()
                    return
                }else{
                    req.businessLogic = await responseHelper({
                        "code": 200,
                        "api": "Product",
                        "state": "No Product Found",
                    })
                    next()
                    return
                }
                
            }
        )
    }
}

module.exports = ProductsController