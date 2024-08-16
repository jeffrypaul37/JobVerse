/* Author: Bhishman Desai */
import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import connect from './config/dBConnection.js';
import {initializeSocket} from './config/socketConnection.js';
import apiRoutes from './router/apiRoutes.js';


const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors({
    origin: "*",
}));
app.use(morgan('tiny'));
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
});

app.use('/api', apiRoutes);

initializeSocket(server);

const port = 8080;

connect().then(() => {
    try {
        server.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        })
    } catch (error) {
        console.log('Cannot connect to the server.');
    }
}).catch(error => {
    console.log("Invalid database connection!");
});
