import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import passport from 'passport';
import { corsOptions, rootResponse } from './app/utils';
import { globalErrorHandler, notFound } from './app/middlewares';
import { envVars } from './app/config';
import { router } from './app/routes';
import './app/config/passport';

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
app.use(cors({ ...corsOptions }));

app.use('/api/v1', router);

app.get('/', rootResponse);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
