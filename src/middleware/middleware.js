const jwt = require('jsonwebtoken');


function verifyToken(req,res,next){
    const authHeader = req.header.authorization;

    if(!authHeader){
        res.status(400).json({message : "Token is missing"});
    }

    const token = authHeader.split(" ")[1];

    if(!token){
        res.status(400).json({message : "Token is missing"});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
        res.status(200).json({message: "Authorized"})
    } catch (error) {
        res.status(400).json({message : "invalid token"})
    }
} 

module.exports = verifyToken;