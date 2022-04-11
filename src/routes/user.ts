import { Request, Response, Router } from "express";
import User from "../models/User";
import verifyToken from "../verifyToken";

const router = Router();

router.get('/', verifyToken, async (req: Request, res: Response) => {
    const { id } = res.locals.user;
    const user = await User.findOne({ _id: id});
    if (!user) return res.status(500).json('Some internal server issue!')
    const {_id, email, ...info} = user._doc;
    return res.json({'user': {_id, email}});
});

export default router;