const responseHelper = require('../../helper/response.helper');

module.exports = {
    emailMiddleware: async (req, res, next) => {
        const email = req.body.email;
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
        {
          next()
          return
        } else{ 
            req.businessLogic = await responseHelper({
                "code": 401,
                "api": "Create User",
                "message": "Email Not Valid",
                "entity": "Auth",
                "state": "emailNotValid"
            })
            next()
            return
        }
    }
};