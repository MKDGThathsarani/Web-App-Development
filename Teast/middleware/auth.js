const jwt = require ('jsonwebtoken');

const SECRET_KEY = 'hict32022-super-secrent';

function verifyToken(req,res,next){
    const authHeader = req.headers['authorization'];

    console.log('Auth header:',authHeader);

    if(!authHeader){
        return res.status(401).json({
            success : false,
            message : `No token provided, Please log in.`
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token){
        return res.status(401).json({
            success : false,
            message : `Invalid token format. Use: Bearer <token>`
        });
    }
    try{
        const decoded  = jwt.verify(token,SECRET_KEY);

        console.log('Token verified for user:', decoded.username);

        req.user = decoded;

        next();
    }catch(error){
        console.log('Token verification failed:', error.message);

        return res.status(403).json({
            success : false,
            message : `Invalid or expired token`,
            error : error.message
        });
    }

}

function requireRole(role){
    return(req,res,next) => {
        if(!req.user){
            return res.status(401).json({
                success : false,
                message : `Not authenticated`
            });
        }

        if (req.user.role !== role){
            return res.status (403).json({
                success : false,
                message : `Requires ${role} role. Your role: ${req.user.role}`
            });
        }
        next();
    };
}
module.exports = {verifyToken,requireRole,SECRET_KEY};