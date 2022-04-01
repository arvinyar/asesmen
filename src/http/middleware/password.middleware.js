const responseHelper = require('../../helper/response.helper');

module.exports = {
    passwordMiddleware: async (req, res, next) => {
        const password = req.body.password;
        if (/^^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/.test(password))
        {
          next()
          return
        } else{ 
            req.businessLogic = await responseHelper({
                "code": 401,
                "api": "Create User",
                "message": "Password must contains 6 characters and at least one symbol, one letter and one number",
                "entity": "Auth",
                "state": "passwordNotValid"
            })
            next()
            return
        }
    }
};