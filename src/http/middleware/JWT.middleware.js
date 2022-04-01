const jwt = require('jsonwebtoken');
const responseHelper = require('../../helper/response.helper');

module.exports = {
    JWTMiddleware: async (req, res, next) => {
        const authHeader = req.header('Authorization')
        console.log(authHeader)
        try {
            if (authHeader == undefined) {
                console.log('a')
                req.businessLogic = await responseHelper({
                    "code": 401,
                    "message": "No Bearer Token",
                    "entity": "BearerToken",
                    "state": "noBearerToken",
                })
                //res.status(401).send(bodyRes)
                next()
                return
            }
            if (authHeader.indexOf("Bearer ") >= 0) {
                const token = authHeader.split("Bearer ")
                var decoded = jwt.verify(token[1], process.env.SECRET);
                var user_id = decoded.uid;
                req.user_id = user_id;
                bearer = 1
                next()
                return
            } else {
                /*
                res.status(401).send(bodyRes)
                return
                */
                req.businessLogic = await responseHelper({
                    "code": 401,
                    "message": "No Bearer Token",
                    "entity": "BearerToken",
                    "state": "noBearerToken",
                })
                next()
                return
            }

        } catch (error) {
            console.log(error)
            if (error.name === 'TypeError') {
                /*
                const bodyRes = {
                    code: 401,
                    message: "Unauthorized"
                }
                res.status(401).send(bodyRes)
                return
                */
                req.businessLogic = await responseHelper({
                    "code": 401,
                    "message": "No Bearer Token",
                    "entity": "BearerToken",
                    "state": "noBearerToken",
                })
                next()
                return
            }
            if (error.name === 'TokenExpiredError') {
                /*
                const bodyRes = {
                    code: 401,
                    message: "Token Expired"
                }
                res.status(401).send(bodyRes)
                return
                */
               req.businessLogic = await responseHelper({
                "code": 401,
                "message": "Token Expired",
                "entity": "BearerToken",
                "state": "tokenExpired",
            })
            next()
            return
            }
            /*
            const bodyRes = {
                code: 500,
                message: "Internal Server Error"
            }
            res.status(500).send(bodyRes)
            return
            */
           req.businessLogic = await responseHelper({
            "code": 500,
            "message": "Internal Server Error",
            "entity": "BearerToken",
            "state": "internalServerError",
        })
        return
        }



        /*

        try {
            const authHeader = req.header('Authorization')
        if (authHeader.indexOf("Basic ") >= 0) {
            const token = authHeader.split("Basic ")
            const authData = Buffer.from(token[1], 'base64').toString()
            const credential = authData.split(':')
            const username = credential[0]
            const password = credential[1]
    
            if (username === "tata" && password === "12345678") {
                next()
            } else {
                const bodyRes = {
                  message: "Unauthorized"
                }
                res.status(401).send(bodyRes)
                return
            }
        } else if (authHeader.indexOf("Apikey ") >= 0) {
            const token = authHeader.split("Apikey ")
            if (token[1] === '1234567890987654321') {
                next()
            } else {
                const bodyRes = {
                  message: "Unauthorized"
                }
                res.status(401).send(bodyRes)
                return
            }
        } else if (authHeader.indexOf("Bearer ") >= 0) {
            const token = authHeader.split("Bearer ")
            var decoded = jwt.verify(token[1], process.env.SECRET);
            req.user = decoded
            next()
        } else {
            const bodyRes = {
                message: "Unauthorized"
              }
            res.status(401).send(bodyRes)
            return
        }
        } catch(error) {
            console.log(error)
            if (error.name === 'TypeError') {
                const bodyRes = {
                    message: "Unauthorized"
                  }
                res.status(401).send(bodyRes)
                return 
            }
            if (error.name === 'TokenExpiredError') {
                const bodyRes = {
                    message: "Token Expired"
                  }
                res.status(401).send(bodyRes) 
                return
            }
            const bodyRes = {
                message: "Internal Server Error"
            }
            res.status(500).send(bodyRes)
            return
        }

        */
    }
};
