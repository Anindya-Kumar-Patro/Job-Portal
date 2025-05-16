import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'

export const register = async (req, res) => {
    try {
        const {fullname, email, phonenumber, password, role} = req.body;
        if(!fullname || !email || !password || !phonenumber || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({
                message: "User is already registered with this email id",
                success: false
            })
        }
        const hashedPwd = await bcrypt.hash(password, 10)

        await User.create({
            fullname, 
            email, 
            phonenumber, 
            password: hashedPwd, 
            role
        })

        return res.status(201).json({
            message: 'Account created Successfully',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const login = async (req, res) => {
    try {
        const {email, password, role} = req.body;
        if(!email || !password || !role) {
            return res.status(400).json({
                message: "Incorrect Username or password",
                success: false
            })
        }
        let user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({
                message: "User is not registered",
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect Username or password",
                success: false
            })
        }
        if (role !== user.role) {
            return res.status(400).json({
                message: "Incorrect Role",
                success: false
            })
        }
        user = {
            _id: user._id,
            fullname: user.fullname,
            phoneNumber: user.phonenumber,
            role: user.role,
            email: user.email,
            profile: user.profile,

        }
        const tokenData = {
            userID : user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn:'1d'})
        return res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpsOnly:true, sameSite: 'strict'}).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req, res) => {
    try {
        res.status(200).cookie("token", "", {maxAge:0}).json({
            message: "Logged Out Successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateProfile = async (req, res) => {
    // const { bio, skills, resumeLink, resumeOriginalName, company, profilePhoto} = req.body
    try {
        const {fullname, email, phonenumber, bio, skills} = req.body;
        const file = req.file;
        // let skillsArray;
        // if (skills) skillsArray = skills.split(",")
        const userID = req.id
        let user = await User.findById(userID)
        if (!user) {
            res.status(400).json({
                message: "User not found",
                success: false
            })
        }
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phonenumber) user.phonenumber = phonenumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skills

        await user.save()

        user = {
            _id: user._id,
            fullname: user.fullname,
            phoneNumber: user.phonenumber,
            role: user.role,
            email: user.email,
            profile: user.profile,
        }
        return res.status(200).json({
            message: "User data updated",
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}