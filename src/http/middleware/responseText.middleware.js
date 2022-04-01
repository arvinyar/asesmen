module.exports = async function responseMiddleware (req, res, next){
    res.header("Content-Type",'text/html');
    res.status(req.businessLogic.code).send(req.businessLogic)
}