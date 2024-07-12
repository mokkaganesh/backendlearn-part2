import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

//to accept the json data
app.use(express.json({
    limit: '50kb',
}));

//to accept the form data
app.use(express.urlencoded({
    extended: true,
    limit: '50kb',
}));

//to store the imgaes,favicon,css,js files
app.use(express.static('public'));

//
app.use(cookieParser());



export default app;