import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/connectDB.js';
import { corsOptions } from './config/corsOptions.js';
import morgan from 'morgan';

import authRoute from './routes/auth.route.js';
import productRoute from './routes/admin/products.route.js';

dotenv.config();
connectDB();

const app = express();

app
	.use(cors(corsOptions))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(express.static('public'))
	.use(cookieParser());

app.use(morgan('tiny'));

app.get('/', (req,res)=> res.send('e-commerce server'));

app
	.use('/api/auth', authRoute)
	.use('/api/admin/products', productRoute)

const port = process.env.PORT || 3500;
app.listen(port, 
	(err)=> {
		if(err) 
			console.error(err);
		else 
			console.log(`server is up and running on port: ${port}`);
	})