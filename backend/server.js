import path from 'path';
import express from "express";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import {notFound, errorHandler} from './middleware/errorMiddleware.js';


import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const PORT = process.env.PORT || 5000;

//CONNECT DB
connectDB();

//INTIALIZE EXPRESS
const app = express();


//BODY PARSER MIDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//COOKIE PARSER (This will allow us to access req.cookies)
app.use(cookieParser());

//ROUTES
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes)

//Paypal route
app.get('/api/config/paypal', (req, res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}));

//STATIC ROUTE
const __dirname = path.resolve(); //Set __dir to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    //any route that is not api will redirect to index.html
    app.get('*', (req, res) => 
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
}else{
    app.get('/', (req, res) => res.send('API Running'));
};


//MIDDLEWARE ERROR HANDLER
app.use(notFound);
app.use(errorHandler);


//SERVER
app.listen(PORT, () => console.log(`Server running ont ${PORT}`));



