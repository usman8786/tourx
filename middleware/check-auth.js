const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        next({
            message: 'Authorization Failed, Login or Register first!',
            SwaggerTesting:"If you can't access all users, Use Postman with Authorization header from User Login Token",
            status: 401
        });
    }
};