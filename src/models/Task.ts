import { Schema, model } from 'mongoose';

const TaskSchema: Schema = new Schema(
    {
        name: {type: String, required: true, unique: true},
    }
);

export default model("Task", TaskSchema);