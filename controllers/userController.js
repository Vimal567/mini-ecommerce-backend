const UserModel = require("../models/userModel");
const bcrypt = require('bcrypt');

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const userData = await UserModel.findOne({ email });

    const responseData = {
        id: userData._id,
        name: userData.name,
        email: userData.email
    };

    if (userData) {
        const isPasswordMatching = await bcrypt.compare(password, userData.password);
        if (isPasswordMatching) {
            res.json({
                success: true,
                data: responseData
            });
        } else {
            res.json({
                success: false,
                message: "Password is incorrect"
            });
        }
    } else {
        res.json({
            success: false,
            message: "No records found!"
        });
    }


}

exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const existingData = await UserModel.findOne({ email });
        if (existingData) {
            res.json({
                success: false,
                message: "Email already exists!"
            });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userDetails = await UserModel.create({ name, email, password: hashedPassword });

        const responseData = {
            id: userDetails._id,
            name: userDetails.name,
            email: userDetails.email
        };

        res.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        res.json({
            success: false,
            error: error
        });
    }
}

exports.updateUser = async (req, res, next) => {
    const { id, name, old_password, password } = req.body;
    try {
        const userDetails = await UserModel.findById(id);
        if (!userDetails) {
            res.json({
                success: false,
                message: "User not found!"
            });
            return;
        }

        // Update name if provided
        if (name) {
            userDetails.name = name;
        }

        // Update password if provided
        if (password) {
            //check if old password matches
            const isPasswordMatching = await bcrypt.compare(old_password, userDetails.password);
            if (!isPasswordMatching) {
                res.json({
                    success: false,
                    message: "Old Password is incorrect"
                });
                return;
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            userDetails.password = hashedPassword;
        }

        // Save the updated user
        const updatedUser = await userDetails.save();

        const responseData = {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        };

        res.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
};