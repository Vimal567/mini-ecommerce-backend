const UserModel = require("../models/userModel");
const bcrypt = require('bcrypt');

exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    const userData = await UserModel.findOne({email});

    if (userData) {
        const isPasswordMatching = await bcrypt.compare(password, userData.password);
        if (isPasswordMatching) {
            res.json({
                sucess: true,
                userData
            });
        } else {
            res.json({
                sucess: false,
                message: "Password is incorrect"
            });
        }
    } else {
        res.json({
            sucess: false,
            message: "No records found!"
        });
    }


}

exports.register = async (req, res, next) => {
    const {name, email, password} = req.body;
    try {
        const existingData = await UserModel.findOne({email});
        if (existingData) {
            res.json({
                sucess: false,
                message: "Email already exists!"
            });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userDetails = await UserModel.create({name, email, password: hashedPassword});

        res.json({
            sucess: true,
            userDetails
        });
    } catch (error) {
        res.json({
            sucess: false,
            error: error
        });
    }

}