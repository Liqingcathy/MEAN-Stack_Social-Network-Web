const jwt = require('jsonwebtoken');
const config = require('config');

//export a middleware function 
module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('x-auth-token');

    //check if no token send denied message
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    //verify token
    try { //decode token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valide' });
    }
};