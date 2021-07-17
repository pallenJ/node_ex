import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes';
import logger from '@shared/Logger';
import mongoose  from 'mongoose';
import dbInfo from '@infos/dbInfo.json';
import cors from 'cors'

import {UserConfig} from './passport'
import passport from 'passport';

const app = express();
const { BAD_REQUEST } = StatusCodes;



/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

UserConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

const options = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(options));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

const connect = async()=>{
    await mongoose.connect(`${dbInfo.mongoDBUrl}`,{
    dbName:'myHome',
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})}
connect().then().catch(error =>logger.err(error));

// Add APIs
app.use('/', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});



/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

/* const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir)); */
/* app.get('/', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: viewsDir});
}); */


//require('@daos/TestSample.dao');
// Export express instance
export default app;
