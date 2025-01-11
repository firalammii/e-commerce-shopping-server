import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/connectDB.js';
import authRoute from './routes/auth.route.js';
import { corsOptions } from './config/corsOptions.js';
import morgan from 'morgan';

dotenv.config();
connectDB();

const app = express();

app
.use(cors(corsOptions))
.use(express.json())
.use(express.urlencoded({extended:true}))
.use(cookieParser());

app.use(morgan('tiny'));

app.get('/', (req,res)=> res.send('e-commerce server'));

app
	.use('/api/auth', authRoute)

const port = process.env.PORT || 3500;
app.listen(port, 
	(err)=> {
		if(err) 
			console.error(err);
		else 
			console.log(`server is up and running on port: ${port}`);
	})