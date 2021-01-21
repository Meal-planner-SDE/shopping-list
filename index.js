"use strict";
/*********
 * Index of the service
 *   Here we configure all the stuff that belongs to the service
 *   in general, such as global middlewares, libs initializations
 *   (if needed), etc.
 *   The code written in here is executed just once!
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
// import require from 'require';
// import process from 'process'
// import config from './config';
const routes_1 = __importDefault(require("./src/routes"));
const PORT = process.env.PORT || 9999;
const index = express_1.default();
// Log stack trace of errors (to be used only on development phases!)
index.use(errorhandler_1.default());
// Log HTTP requests
index.use(morgan_1.default('dev'));
// Compress all responses
index.use(compression_1.default());
// Decode body responses
index.use(express_1.default.json());
index.use(express_1.default.urlencoded({ extended: true }));
// Enable Cross-Origin Resource Sharing
index.use(cors_1.default());
// Uses router for all routes (we split the server logics and the routes definition)
index.use('/', routes_1.default);
// Start listening for requests! :)
index.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running on port ${PORT}`);
});
