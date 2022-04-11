import jwt from 'jsonwebtoken';
import { Request,  Response, NextFunction} from 'express';

function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY || '123', (err, user) => {
            if (err) return res.status(401).json('Invalid Token!!');
            res.locals.user = user;
            next();
        });
    } else {
        return res.status(401).json('Authentication Error!')
    }
}

export default verifyToken;