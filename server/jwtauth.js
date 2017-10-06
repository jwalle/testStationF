let url = require('url');
let jwt = require('jwt-simple');

module.exports = function(req, res, next){

    let parsed_url = url.parse(req.url, true);
    let token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];

    if (token) {

        try {
            let decoded = jwt.decode(token, app.get('jwtTokenSecret'));

            if (decoded.exp <= Date.now()) {
                res.end('Access token has expired', 400)
            }

            if (decoded.iss === 'jwalle')
                return next()

        } catch (err) {
            return next()
        }

    } else {
        next()
    }
};
