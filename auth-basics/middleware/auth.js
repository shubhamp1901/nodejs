const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization

    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]
        if (!token) {
            return res.status(404).json({success: false, message: "Authorization Denied"})
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode;
            // forward the request
            next();
        } catch (error) {
            res.status(400).json({success: false, message: "Token is not valid"})
        }
    } else {
        res.status(404).json({success: false, message: "Authorization Denied"})
    }


}

module.exports = verifyToken