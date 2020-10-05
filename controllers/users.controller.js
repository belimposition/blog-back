var UsersService = require('../services/users.service');
var jwt = require('jsonwebtoken');
var config = require('../config');

exports.createUser = async function (req, res, next) {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    try {
        const [token, createdUser] = await UsersService.createUser(user);

        res.cookie('authToken', token, { httpOnly: true, maxAge: 86400000, path:'/' });
        return res.status(201).json({data: createdUser, message: "Succesfully Created User"})
    } catch (e) {
        return res.status(400).json({status: 400, message: "User Creation was Unsuccesfull"})
    }
}


exports.loginUser = async function (req, res, next) {
    var User = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        var [token, loginUser] = await UsersService.loginUser(User);
        res.cookie('authToken', token, { httpOnly: true, maxAge: 86400000, path:'/' });
        return res.status(201).json({data: loginUser, message: "Succesfully login"})
    } catch (e) {
        return res.status(400).json({status: 400, message: "Invalid username or password"})
    }
}

exports.authUser = async function (req, res, next) {
    const authToken = req.body.token;

    try {
        if (!authToken) res.status(201).json({message: "Token not found"});

        const { id } = jwt.verify(authToken, config.SECRET);
        const user = await UsersService.getUser(id);

        if (user.name) {
            return res.status(201).json({data: user, message: "Succesfully login"});
        }

        return res.status(400).json({message: "Invalid token or user not found"});
        

    } catch (e) {
        return res.status(400).json({status: 400, message: "Invalid token"})
    }
}




exports.logoutUser = async function (req, res, next) {
    try {
        res.clearCookie('authToken', { domain: 'localhost' });
        return res.status(201).json({message: "Succesfully logout"})
    } catch (e) {
        return res.status(400).json({status: 400, message: "Invalid logout"})
    }
}

