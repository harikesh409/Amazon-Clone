const router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const checkJWT = require("../middlewares/check-jwt");

router.post("/signup", (req, res, next) => {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.picture = user.gravatar();
    user.isSeller = req.body.isSeller;

    User.findOne({
            email: req.body.email
        },
        (err, existingUser) => {
            if (err) {
                return res.status(401).json({
                    message: err
                });
            }
            if (existingUser) {
                res.json({
                    success: false,
                    message: "Email already exists!"
                });
            } else {
                user
                    .save()
                    .then(result => {
                        let token = jwt.sign({
                                _id: user._id,
                                email: user.email,
                                name: user.name,
                                avatar: user.picture
                            },
                            process.env.TOKEN, {
                                expiresIn: "3h"
                            }
                        );
                        res.status(201).json({
                            success: true,
                            message: "User Created",
                            token
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err
                        });
                    });
            }
        }
    );
});

router.post("/login", (req, res, next) => {
    User.findOne({
            email: req.body.email
        },
        (err, user) => {
            if (err) {
                return res.status(401).json({
                    error: err
                });
            }
            if (!user) {
                res.json({
                    success: false,
                    message: "Authorization Failed"
                });
            } else if (user) {
                let validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: "Authorization Failed"
                    });
                } else {
                    let token = jwt.sign({
                            _id: user._id,
                            email: user.email,
                            name: user.name,
                            avatar: user.picture
                        },
                        process.env.TOKEN, {
                            expiresIn: "3h"
                        }
                    );
                    res.status(200).json({
                        success: true,
                        message: "Authorization Success",
                        token
                    });
                }
            }
        }
    );
});

router
    .route("/profile")
    .get(checkJWT, (req, res, next) => {
        User.findOne({
                _id: req.decoded._id
            },
            (err, user) => {
                if (err) return next(err);
                res.json({
                    success: true,
                    user,
                    message: "Success"
                });
            }
        );
    })
    .post(checkJWT, (req, res, next) => {
        User.findOne({
                _id: req.decoded._id
            },
            (err, user) => {
                if (err) return next(err);
                if (req.body.name) user.name = req.body.name;
                if (req.body.email) user.email = req.body.email;
                if (req.body.password) user.password = req.body.password;

                user.isSeller = req.body.isSeller;

                user.save();
                res.json({
                    success: true,
                    message: "Successfully updated your Profile."
                });
            }
        );
    });

router
    .route('/address')
    .get(checkJWT, (req, res, next) => {
        User.findOne({
            _id: req.decoded._id
        }, (err, user) => {
            if (err) return next(err);
            res.json({
                success: true,
                message: "Success",
                address: user.address
            });
        });
    })
    .post(checkJWT, (req, res, next) => {
        User.findOne({
            _id: req.decoded._id
        }, (err, user) => {
            if (err) return next(err);
            if (req.body.addr1) user.address.addr1 = req.body.addr1;
            if (req.body.addr2) user.address.addr2 = req.body.addr2;
            if (req.body.city) user.address.city = req.body.city;
            if (req.body.state) user.address.state = req.body.state;
            if (req.body.country) user.address.country = req.body.country;
            if (req.body.postalCode) user.address.postalCode = req.body.postalCode;

            user.save();
            res.json({
                success: true,
                message: "Successfully updated your Address."
            });
        });
    });

module.exports = router;