import { Request, Response, Router } from "express";
import Task from "../models/Task";
import verifyToken from "../verifyToken";

const router = Router();

router.post('/create-task', verifyToken, async (req: Request, res: Response) => {
    const { name } = req.body;
    const task = new Task({
        name: name
    });
    try {
        const newTask = await task.save();
        const { _id, name, ...info } = newTask;
        res.status(201).json({'task': { _id, name}});
    } catch(err) {
        res.status(500).json(err);
    }
    
});

router.get('/list-tasks', verifyToken, async (req: Request, res: Response) => {
    const items = await Task.find().lean().exec();
    try {
        const allTasks = items.map((task) => {
            const { _id, name, ...info } = task;
            return {_id, name};
        })
        res.status(200).json({'tasks': allTasks});
    } catch(err) {
        res.status(500).json(err);
    }
});

export default router;