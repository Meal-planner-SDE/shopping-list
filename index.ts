/*********
 * Index of the service
 *   Here we configure all the stuff that belongs to the service
 *   in general, such as global middlewares, libs initializations
 *   (if needed), etc.
 *   The code written in here is executed just once!
 */


import express from 'express';
import errorHandler from 'errorhandler';
import logger from 'morgan';
import compression from 'compression';
import cors from 'cors';
require('dotenv').config();
// import require from 'require';
// import process from 'process'
// import config from './config';
import router from './src/routes';

const PORT = process.env.PORT || 8888;
const index = express();

// Log stack trace of errors (to be used only on development phases!)
index.use(errorHandler());
// Log HTTP requests
index.use(logger('dev'));
// Compress all responses
index.use(compression());
// Decode body responses
index.use(express.json());
index.use(express.urlencoded({ extended: true }));
// Enable Cross-Origin Resource Sharing
index.use(cors());

// Uses router for all routes (we split the server logics and the routes definition)
index.use('/', router);

// Start listening for requests! :)
index.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running on port ${PORT}`);
});
