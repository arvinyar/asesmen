const responseHelper = require('../../helper/response.helper');

class UserController {
    async profile(req, res, next) {
        const user = req.users;
            if(req.businessLogic != undefined){
                next()
                return
            }
            await user.findAll(
                {
                    where:
                    {
                        id:req.user_id
                    }
                }
            ).then(async data => {
                if (data.length > 0) {
                    req.businessLogic = await responseHelper({
                        "code": 200,
                        "api": "Show User",
                        "message": "Get Profile Success",
                        "entity": "Profile",
                        "state": "getProfileSuccess",
                        "data": {
                            "user_data": data
                        }
                    })
                    next()
                    return
                } else {
                    req.businessLogic = await responseHelper({
                        "code": 401,
                        "api": "Show User",
                        "message": "Get Profile Failed",
                        "entity": "Profile",
                        "state": "getProfileFailed",
                    })
                    next()
                    return
                }
            }
            ).catch(async err =>{
                req.businessLogic = await responseHelper({
                    "code": 500,
                    "api": "Auth",
                    "entity": "authentication",
                    "state": "attemptAuthenticationError",
                })
                next()
                return
                }    
            )
    }

   
}

module.exports = UserController