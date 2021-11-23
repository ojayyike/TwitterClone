exports.requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        //Pass on to next step in respose cycle if session.user proerty is set
        return next();
    }
    else {
        return res.redirect('/login');
    }
}