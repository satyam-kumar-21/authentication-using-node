const jwt = require('jsonwebtoken');

const jwtAuth = (req,res,next) =>{
    const token = (req.cookies && req.cookies.token) || null;
    if(!token){
        return res.status(400).json({
            success:false,
            message: "User not authorized"
        })
    }

    try {
        const payLoad = jwt.verify(token,(process.env.SECRET_KEY || "asdfghjkl"))
        req.user = {
            id:payLoad.id,
            email: payLoad.email
        }
    } catch (error) {
        return res.status(400).json({
            success:false,
            message: error.message
        })
    }
    next();
}

module.exports = jwtAuth;