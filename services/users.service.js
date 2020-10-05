var User = require('../models/User.model');
var config = require('../config');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

exports.createUser = async function (user) {
    var hashedPassword = bcrypt.hashSync(user.password, 8);
    var newUser = new User({
        name: user.name,
        email: user.email,
        date: new Date(),
        password: hashedPassword
    });

    try {
        var savedUser = await newUser.save();
        var token = jwt.sign({id: savedUser._id}, config.SECRET, {
            expiresIn: 86400
        });

        return [
            token,
            {
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
            }
        ];
    } catch (e) {   
        throw Error("Error while Creating User")
    }
}

exports.loginUser = async function (user) {
    try {
        var _details = await User.findOne({ email: user.email });
        var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
        if (!passwordIsValid) throw Error("Invalid username/password")
        var token = jwt.sign({id: _details._id}, config.SECRET, {
            expiresIn: 86400
        });

        return [
            token,
            {
                _id: _details._id,
                name: _details.name,
                email: _details.email,
            }
        ];
    } catch (e) {  
        throw Error("Error while Login User")
    }
}


exports.getUser = async function (id) {

    try {
        var user = await User.findById(id);
        return ({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (e) {  
        throw Error("Error while Login User")
    }
}


