module.exports = async function responseMiddleware (req, res, next){
    /*
    const log = req.log;
    console.log(req.body)
    await log.create({
        user_id:req.user_id,
        api:req.route.path,
        header:JSON.stringify(req.headers),
        body: JSON.stringify(req.body) || "",
        result_status:req.businessLogic.code,
        result_message:JSON.stringify(req.businessLogic)
    })
    console.log(req.route.path);
    console.log(req.businessLogic)
    */
    res.header("Content-Type",'application/json');
    res.status(req.businessLogic.code).send(req.businessLogic)
}