const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.headers["authorization"];
    if (token) {
        jwt.verify(token, process.env.TOKEN, (err, decoded) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Failed to authenticate token'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).json({
            success: false,
            message: 'No token provided'
        });
    }
}