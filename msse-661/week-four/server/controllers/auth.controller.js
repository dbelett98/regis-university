// following Professor Morgan's video

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const con = require('../db-config');
const jwtconfig = requiree('../jwt-config');
const authQueries = require('../queries/auth.queries');
const userQueries = require('../queries/user.queries');
const userQueries = require('../queries/user.queries');


exports.registerUser = function(req, res) {
    const passwordHash = bcrypt.hashSync(req.body.password);

    con.query(
        authQueries.INSERT_NEW_USER,
        [req.body.username, req.body.email, passwordHash],
        function(err, result) {
            if (err) {
                //stop registration
                console.log(err);
                res
                    .status(500)
                    .send({msg: 'Could not register user. Please try again later.'});
            }

            con.query(userQueries.GET_ME_BY_USERNAME, [req.body.username], function(
                err,
                user
            ) {
                if (err) {
                    res.status(500)
                    res.send({ msg: 'Could not retrieve user.'});
                }

                console.log(user);
                res.send(user);
            });
        }
    );
};