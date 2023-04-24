const jwt = require('jsonwebtoken');
const jwtKey = "ThisIsKey";

function loginAuth(req, res, next) {
    const Header = req.headers.authorization
    if (typeof Header !== 'undefined') {
        const token = Header.split(" ")[1];
        const goodToken = token.substring(1, token.length - 1)
        jwt.verify(goodToken, jwtKey, (err, authdata) => {
            if (err) {
                res.status(400).send("Token invalid")
            }
            else {
                next();
                // res.json({ message: "Accessed" })
            }
        })
    } else {
        res.send({ result: "Token is not valid" })
    }
}

module.exports = loginAuth;