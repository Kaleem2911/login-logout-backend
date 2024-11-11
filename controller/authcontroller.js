const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");



async function signup(req, res) {
    const { username, email, password } = req.body;
    try{
        // check if user already exists
        const exixtingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // create new user
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({message: "User created successfully"});
        //generate token
        const token = jwt.sign({email: newUser.email, id: newUser._id}, process.env.SECRET_KEY, {expiresIn: "1h"});
        res.cookie("token", token, {httpOnly: true});
        res.status(201).send("User created successfully");
    }catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    };
};


async function login(req, res) {
    const { email, password } = req.body;
    try{
        // check if user exists
        const existingUser = await userModel.findOne({email});
        if(!existingUser){
            return res.status(404).send("User not found");
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(400).send("Invalid credentials");
        }

        // generate token
        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.SECRET_KEY, {expiresIn: "1h"});
        res.cookie("token", token, {httpOnly: true});
        res.status(200).send("Login successful");
    }catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    };
};


module.exports = {
    signup, login
}