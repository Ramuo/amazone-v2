import express from "express";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';


const PORT = process.env.PORT || 5000;

//CONNECT DB
connectDB();

//INTIALIZE EXPRESS
const app = express();


//BODY PARSER
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//COOKIE PARSER
app.use(cookieParser());

//ROUTES
app.get('/', (req, res) => res.send('API Running'));


//MIDDLEWARE


//SERVER
app.listen(PORT, () => console.log(`Server running ont ${PORT}`));




//mongodb+srv://alpha123:alpha123@devconnector.9jnudcn.mongodb.net/DevConnector?retryWrites=true&w=majority

//mongodb+srv://alpha123:alpha123@devconnector.9jnudcn.mongodb.net/