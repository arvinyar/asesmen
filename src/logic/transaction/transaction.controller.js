const responseHelper = require('../../helper/response.helper');
const { Op } = require("sequelize");

class TransactionController {
    async add_cart(req, res, next) {
        if (req.businessLogic != undefined) {
            next()
            return
        }
        const transactions = req.transactions;
        const carts = req.carts;
        const { product_id, total_items } = req.body

        if (product_id == undefined || product_id == "" || total_items == undefined || total_items == "" || total_items == 0) {
            req.businessLogic = await responseHelper({
                "code": 422,
                "api": "Add To Cart",
                "state": "Bad Request",
            })
            next()
            return
        }

        const products = req.products;
        if (req.businessLogic != undefined) {
            next()
            return
        }
        await transactions.findOrCreate(
            {
                where: {
                    user_id: req.user_id,
                    status: 'cart',
                }
            }
        ).then(async data => {
            const transaction_id = data[0].id
            let products_purchased = await products.findOne(
                {
                    where: {
                        id: product_id,
                        quantity: {
                            [Op.gte]: total_items
                        }
                    }
                }
            ).
                then(
                    async data => {
                        if (data) {
                            const items_stock = data.quantity
                            let total_prices
                            let promo = data.promo
                            if (data.promo > 0) {
                                total_prices = (total_items - Math.floor(total_items / (promo + 1))) * data.price
                            } else {
                                total_prices = total_items * data.price
                            }
                            await carts.findOrCreate({
                                where: {
                                    transaction_id: transaction_id,
                                    product_id: product_id,
                                },
                                defaults: {
                                    transaction_id: transaction_id,
                                    product_id: product_id,
                                    total_items: total_items,
                                    unit_price: data.price,
                                    total_prices: total_prices
                                }
                            }
                            ).
                                then(async data => {
                                    console.log(data[0]._options.isNewRecord)
                                    if (!data[0]._options.isNewRecord) {
                                        if (promo > 0) {
                                            total_prices = ((total_items + data[0].total_items) - Math.floor((total_items + data[0].total_items) / (promo + 1))) * data[0].unit_price
                                        } else {
                                            console.log(data[0].total_items)
                                            total_prices = (total_items + data[0].total_items) * data[0].unit_price
                                        }
                                        await carts.update(
                                            {
                                                total_items: total_items + data[0].total_items,
                                                total_prices: total_prices
                                            },
                                            {
                                                where: {
                                                    product_id: product_id,
                                                    transaction_id: transaction_id
                                                }
                                            }
                                        )
                                    }
                                }).catch(async err => {
                                    req.businessLogic = await responseHelper({
                                        "code": 200,
                                        "api": "Add To Cart",
                                        "state": "Failed to add new items",
                                    })
                                    next()
                                    return
                                }
                                )
                            await products.update(
                                {
                                    quantity: items_stock - total_items
                                },
                                {
                                    where: {
                                        id: product_id,
                                    }
                                }
                            ).catch(async err => {
                                req.businessLogic = await responseHelper({
                                    "code": 200,
                                    "api": "Add To Cart",
                                    "state": "Failed to reduce stocks",
                                })
                                next()
                                return
                            }
                            )
                            req.businessLogic = await responseHelper({
                                "code": 200,
                                "api": "Add to Cart",
                                "state": "Add to Cart Success",
                                "data": req.body
                            })
                            next()
                            return
                        }
                        else {
                            req.businessLogic = await responseHelper({
                                "code": 200,
                                "api": "Add To Cart",
                                "state": "No Item left",
                            })
                            next()
                            return
                        }


                    }

                ).catch(
                    async err => {
                        console.log(err)
                        req.businessLogic = await responseHelper({
                            "code": 500,
                            "api": "Add To Cart",
                            "state": "Add to cart failed",
                        })
                        next()
                        return
                    }
                )



        }
        )
    }


    async view_cart(req, res, next) {
        if (req.businessLogic != undefined) {
            next()
            return
        }
        const transactions = req.transactions
        const carts = req.carts;
        const status = req.params.status
        console.log(status)
        if (status != 'cart' && status != 'checkout' && status != 'paid' && status != 'all') {
            req.businessLogic = await responseHelper({
                "code": 200,
                "api": "View Cart",
                "state": "Status not found"
            })
            next()
            return
        }
        let query
        if (status == 'cart' || status == 'checkout' || status == 'paid') {
            query = {
                where: {
                    user_id: req.user_id,
                    status: status,
                },
                include: [{ model: carts, attributes: ['product_id', 'total_items', 'unit_price', 'total_prices'], as: "carts" }]
            }
        } else {
            query = {
                where: {
                    user_id: req.user_id,
                },
                order: [
                    ['status', 'DESC']
                ],
                include: [{ model: carts, attributes: ['product_id', 'total_items', 'unit_price', 'total_prices'], as: "carts" }]
            }
        }


        await transactions.findAll(
            query
        ).then(
            async data => {

                if (data.length > 0) {


                    for (let k = 0; k < data.length; k++) {
                        let total_price_cart = 0
                        for (let i = 0; i < data[k].carts.length; i++) {
                            total_price_cart = total_price_cart + data[k].carts[i].dataValues.total_prices
                        }
                        data[k].dataValues.total_price_cart = total_price_cart
                    }


                    req.businessLogic = await responseHelper({
                        "code": 200,
                        "api": "View Cart",
                        "state": "Cart found",
                        "data": data,
                    })
                    next()
                    return
                } else {
                    req.businessLogic = await responseHelper({
                        "code": 200,
                        "api": "View Cart",
                        "state": "No Cart for User",
                        "data": data
                    })
                    next()
                    return
                }
            }
        ).catch(
            async err => {
                console.log(err)
                req.businessLogic = await responseHelper({
                    "code": 500,
                    "api": "View Cart",
                    "state": "View Cart Failed",
                })
                next()
                return
            }
        )
    }

    async delete_cart(req, res, next) {
        if (req.businessLogic != undefined) {
            next()
            return
        }
        const transactions = req.transactions
        const carts = req.carts;
        const products = req.products;
        const { product_id } = req.body
        if (product_id == undefined || product_id == "") {
            req.businessLogic = await responseHelper({
                "code": 422,
                "api": "Delete From Cart",
                "state": "Bad Request",
            })
            next()
            return
        }

        if (req.businessLogic != undefined) {
            next()
            return
        }
        console.log(1)

        await transactions.findOne(
            {
                where: {
                    status: "cart",
                }
            }
        ).then(
            async data => {
                let id = data.id
                console.log(id)
                if (data) {
                    await carts.findOne(
                        {
                            where: {
                                transaction_id: id,
                                product_id: product_id,
                            }
                        }
                    ).then(async data => {
                        if (data) {
                            let added_stock = data.total_items
                            await carts.destroy(
                                {
                                    where: {
                                        transaction_id: id,
                                        product_id: product_id,
                                    }
                                }
                            ).then(async data => {
                                if(data){
                                    await products.findOne({
                                        where: {
                                            id: product_id
                                        }
                                    }
                                    ).then(async data => {
                                        await products.update(
                                            {
                                                quantity: data.quantity + added_stock
                                            }, {
                                            where: {
                                                id: product_id
                                            }
                                        }
                                        ).catch(
                                            async err => {
                                                console.log(err)
                                                req.businessLogic = await responseHelper({
                                                    "code": 500,
                                                    "api": "Delete From Cart",
                                                    "state": "Readd item Failed",
                                                })
                                                next()
                                                return
                                            }
                                        )
                                    }
                                    )
                                }
                                

                            }
                            ).catch(
                                async err => {
                                    console.log(err)
                                    req.businessLogic = await responseHelper({
                                        "code": 500,
                                        "api": "Delete From Cart",
                                        "state": "Readd item Failed",
                                    })
                                    next()
                                    return
                                }
                            )
                        } else {
                                req.businessLogic = await responseHelper({
                                    "code": 200,
                                    "api": "Delete from Cart",
                                    "state": "Product Not Found",
                                    "data": req.body
                                })
                                next()
                                return
                        }
                    }
                    ).catch(
                        async err => {
                            console.log(err)
                            req.businessLogic = await responseHelper({
                                "code": 500,
                                "api": "Delete From Cart",
                                "state": "Delete item Failed",
                            })
                            next()
                            return
                        }
                    )
                } else {
                    req.businessLogic = await responseHelper({
                        "code": 200,
                        "api": "Delete from Cart",
                        "state": "No Cart Found",
                        "data": req.body
                    })
                    next()
                    return
                }
                req.businessLogic = await responseHelper({
                    "code": 200,
                    "api": "Delete from Cart",
                    "state": "Items Sudah Dihapus",
                    "data": req.body
                })
                next()
                return

            }

        ).catch(
            async err => {
                console.log(err)
                req.businessLogic = await responseHelper({
                    "code": 500,
                    "api": "Delete From Cart",
                    "state": "Delete item Failed",
                })
                next()
                return
            }
        )

    }

    async checkout(req, res, next) {
        if (req.businessLogic != undefined) {
            next()
            return
        }
        const transactions = req.transactions
        const carts = req.carts;
        const { transaction_id } = req.body
        if (transaction_id == undefined || transaction_id == "") {
            req.businessLogic = await responseHelper({
                "code": 422,
                "api": "Checkout",
                "state": "Bad Request",
            })
            next()
            return
        }

        await transactions.findOne({
            where: {
                user_id: req.user_id,
                id: transaction_id,
                status: 'cart'
            },
            include: [{ model: carts, attributes: ['product_id', 'total_items', 'unit_price', 'total_prices'], as: "carts" }]
        }).then(async data => {
            if (data) {
                await transactions.update(
                    {
                        status: 'checkout',
                    },
                    {
                        where: {
                            user_id: req.user_id,
                            id: transaction_id
                        }
                    }
                ).catch(
                    async err => {
                        console.log(err)
                        req.businessLogic = await responseHelper({
                            "code": 500,
                            "api": "Checkout",
                            "state": "Checkout Cart Failed",
                        })
                        next()
                        return
                    }
                )
                let total_price_cart = 0
                for (let i = 0; i < data.carts.length; i++) {
                    total_price_cart = total_price_cart + data.carts[i].total_prices
                }
                data.dataValues.total_price_cart = total_price_cart
                req.businessLogic = await responseHelper({
                    "code": 200,
                    "api": "Checkout",
                    "state": "Checkout Success",
                    "data": data,
                })
                next()
                return
            } else {
                req.businessLogic = await responseHelper({
                    "code": 200,
                    "api": "Checkout",
                    "state": "Cart Not found"
                })
                next()
                return
            }
        }).catch(
            async err => {
                console.log(err)
                req.businessLogic = await responseHelper({
                    "code": 500,
                    "api": "Checkout",
                    "state": "Checkout Cart Failed",
                })
                next()
                return
            }
        )
    }

    async pay(req, res, next) {
        if (req.businessLogic != undefined) {
            next()
            return
        }
        const transactions = req.transactions
        const carts = req.carts;
        const { transaction_id } = req.body
        if (transaction_id == undefined || transaction_id == "") {
            req.businessLogic = await responseHelper({
                "code": 422,
                "api": "Checkout",
                "state": "Bad Request",
            })
            next()
            return
        }

        await transactions.findOne({
            where: {
                user_id: req.user_id,
                id: transaction_id,
                status: {
                    [Op.not]:'paid'
                }
            },
            include: [{ model: carts, attributes: ['product_id', 'total_items', 'unit_price', 'total_prices'], as: "carts" }]
        }).then(async data => {
            if (data) {
                await transactions.update(
                    {
                        status: 'paid',
                    },
                    {
                        where: {
                            user_id: req.user_id,
                            id: transaction_id
                        }
                    }
                ).catch(
                    async err => {
                        console.log(err)
                        req.businessLogic = await responseHelper({
                            "code": 500,
                            "api": "Payment",
                            "state": "Payment Failed",
                        })
                        next()
                        return
                    }
                )
                let total_price_cart = 0
                for (let i = 0; i < data.carts.length; i++) {
                    total_price_cart = total_price_cart + data.carts[i].total_prices
                }
                data.dataValues.total_price_cart = total_price_cart
                req.businessLogic = await responseHelper({
                    "code": 200,
                    "api": "Payment",
                    "state": "Payment Success",
                    "data": data,
                })
                next()
                return
            } else {
                req.businessLogic = await responseHelper({
                    "code": 200,
                    "api": "Payment",
                    "state": "Cart Not found"
                })
                next()
                return
            }
        }).catch(
            async err => {
                console.log(err)
                req.businessLogic = await responseHelper({
                    "code": 500,
                    "api": "Payment",
                    "state": "Payment Cart Failed",
                })
                next()
                return
            }
        )
    }

}

module.exports = TransactionController