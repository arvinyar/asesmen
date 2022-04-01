const responseHelper = require('../../helper/response.helper');
const jwt = require('jsonwebtoken');

class AuthController {
    async auth(req, res, next) {
        const { email, password } = req.body
       
        const user = req.users;
        if (req.businessLogic != undefined) {
            next()
            return
        }
        await user.findAll(
            {
                where:
                {
                    email: email,
                    password: password
                }
            }
        ).then(async data => {
            if (data.length > 0) {
                console.log(data[0].id)
                const token = jwt.sign({
                    uid: data[0].id
                }, process.env.SECRET, { expiresIn: '24h' });
                req.user_id = data[0].id
                req.businessLogic = await responseHelper({
                    "code": 200,
                    "api": `Auth by user : ${email} using password : ${password}`,
                    "message": "Attempt Authentication Success",
                    "entity": "authentication",
                    "state": "attemptAuthenticationSuccess",
                    "data": {
                        "token": token
                    }
                })
                next()
                return
            } else {
                req.user_id = 0
                req.businessLogic = await responseHelper({
                    "code": 401,
                    "message": "Username or password invalid",
                    "entity": "authentication",
                    "state": "attemptAuthenticationError",
                })
                next()
                return
            }
        }
        ).catch(async err => {
            console.log(err)
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

    async register(req, res, next) {
        const user = req.user;
        const { name, username, email, password, image } = req.body
       
        if(image != undefined && image != ""){
            var imageName = await ic.upload(req, image);
            imageName = process.env.IMAGE_URL + imageName;
            req.body.image = "encoded into " + imageName;
        } else{
            imageName = ""
        }
        if (req.businessLogic != undefined) {
            next()
            return
        }
        if (name == undefined || username == undefined || email == undefined || password == undefined
            || name == "" || username == "" || email == "" || password == "") {
            req.businessLogic = await responseHelper({
                "code": 401,
                "api": "Create User",
                "message": "Column Not Complete",
                "entity": "Profile",
                "state": "createProfileFailed"
            })
            next()
            return
        }
        await user.findAll({ where: { email: email } })
            .then(async data => {
                if (data.length > 0) {
                    req.businessLogic = await responseHelper({
                        "code": 401,
                        "api": "Create User",
                        "message": "ID Already Taken",
                        "entity": "Profile",
                        "state": "createProfileFailed"
                    })
                    next()
                    return
                } else {
                    await user.create({
                        name: name,
                        username: username,
                        email: email,
                        password: password,
                        image: imageName
                    }).then(
                        async data => {
                            req.businessLogic = await responseHelper({
                                "code": 200,
                                "api": "Create User",
                                "message": "Create User Success",
                                "entity": "User",
                                "state": "createUserSuccess"
                            })
                            req.user_id = data.id
                            next()
                            return
                        }
                    ).catch(async err => {
                        console.log(err)
                        req.businessLogic = await responseHelper({
                            "code": 500,
                            "api": "Create User",
                            "entity": "createUser",
                            "state": "createUserError",
                        })
                        next()
                        return
                    })

                }
            })
            .catch(async err => {
                console.log(err)
                req.businessLogic = await responseHelper({
                    "code": 500,
                    "api": "Create User",
                    "entity": "createUser",
                    "state": "createUserError",
                })
                next()
                return
            })
    }

    async edit(req, res, next) {
        const user = req.user;
        const { name, username, email, password, image } = req.body
        
        if(image != undefined && image != ""){
            var imageName = await ic.upload(req, image);
            imageName = process.env.IMAGE_URL + imageName;
            req.body.image = "encoded into " + imageName;
        }
        if (req.businessLogic != undefined) {
            next()
            return
        }
        if (name == undefined || username == undefined || email == undefined || password == undefined
            || name == "" || username == "" || email == "" || password == "") {
            req.businessLogic = await responseHelper({
                "code": 401,
                "api": "Create User",
                "message": "Column Not Complete",
                "entity": "Profile",
                "state": "updateProfileFailed"
            })
            next()
            return
        }
        await user.findAll({ where: { id: req.user_id } })
            .then(async data => {
                if (data.length > 0) {
                    await user.update({
                        name: name,
                        username: username,
                        email: email,
                        password: password,
                        image: imageName
                    }, {
                            where: {
                                id: req.user_id
                            }
                        }).then(
                            async data => {
                                req.businessLogic = await responseHelper({
                                    "code": 200,
                                    "api": "Update Profile",
                                    "message": "Update Profile SUccess",
                                    "entity": "Profile",
                                    "state": "updateProfileSuccess",
                                })
                                next()
                                return
                            }
                        ).catch(
                            async err => {
                                console.log(err)
                                req.businessLogic = await responseHelper({
                                    "code": 500,
                                    "api": "Update Profile",
                                    "entity": "Update Profile",
                                    "state": "updateProfileError",
                                })
                                next()
                                return
                            }
                        )
                } else {
                    req.businessLogic = await responseHelper({
                        "code": 401,
                        "api": "Edit Profile",
                        "message": "User Not Found",
                        "entity": "editprofile",
                        "state": "editProfileFailed",
                    })
                    next()
                    return
                }
            })
            .catch(async err => {
                console.log(err)
                req.businessLogic = await responseHelper({
                    "code": 500,
                    "api": "update Profle",
                    "entity": "updateProfile",
                    "state": "upateProfileError",
                })
                next()
                return
            })
    }

}
module.exports = AuthController