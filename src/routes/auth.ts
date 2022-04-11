import User from '../models/User';
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import express, { Request, Response } from "express";

const router = express.Router();
const DEFAULT_SECRET_KEY = '123';

// Sign up
router.post('/register', async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email});
    if (user) return res.status(500).json('User already exists');
    const newUser = new User({
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY || DEFAULT_SECRET_KEY).toString()
    });

    try {
        const user = await newUser.save();
        const { _id, email, ...info } = user;
        res.status(201).json({'user': { _id, email}});
    } catch(err) {
        res.status(500).json(err);
    }
    
});

//Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body.email});
        !user && res.status(401).json("Incorrect Username!!");
        const originalPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY || DEFAULT_SECRET_KEY).toString(CryptoJS.enc.Utf8);
        (originalPassword !== req.body.password) && res.status(401).json("Incorrect Password!!");

        const accessToken = jwt.sign(
            {id: user._id}, 
            process.env.SECRET_KEY || DEFAULT_SECRET_KEY, 
            { expiresIn: '5d'}
        );

        const {password, ...info} = user._doc;
        res.status(200).json({accessToken});
    } catch(err) {
        res.status(500).json(err);
    }
});

export default router;