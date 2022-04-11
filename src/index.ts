import express from 'express';
import { json, urlencoded } from 'body-parser';
import mongoose from 'mongoose';
import { AuthRoutes, TaskRoutes, UserRoutes, } from './routes';

require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URL || '')
.then(() => console.log("connection established!"))
.catch((e) => console.log("exceptions: ", e));

app.use(json());
app.use(urlencoded({extended: true}));
app.use('/user', UserRoutes);
app.use('/', AuthRoutes);
app.use('/', TaskRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is listening to ', port));