function EmailAuth(req, res, next) {

    if (req.session.isVerify) {
        next();
        return
    }
    else {
        res.send("NOT VERIFIED");
    }
}

module.exports = EmailAuth;