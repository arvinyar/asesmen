module.exports = async function responseHelper (response){
    const subStatus = response.code.toString().substring(0, 1)
    if (subStatus === "2") {
        return {
            "code": response.code,
            "message": response.message,
            "entity": response.entity,
            "state": response.state,
            "data": response.data || {}
        }
    } else if (subStatus === "4") {
        return {
            "code": response.code,
            "message": response.message,
            "entity": response.entity,
            "state": response.state,
            "error": response.error
        }
    } else if (subStatus === "5") {
        return {
            "code": response.code,
            "message": "Internal Server Error",
            "entity": response.entity,
            "state": response.state,
        }
    } else {
        return {
            "code": response.code,
            "message": "Internal Server Error",
            "entity": response.entity,
            "state": response.state,
        }
    }
}