import cors from 'cors';
import express, { Application } from 'express';
// import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

// Import routes
import adminRoutes from './routes/adminRoutes';
import employeeRoutes from './routes/employeeRoutes';
import generalRoutes from './routes/generalRoutes';

dotenv.config();

const app: Application = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'assets' directory
app.use('/assets', express.static('assets'));

// Apply CORS middleware
app.use(cors());

// Initialize routes
app.use('/api', employeeRoutes);
app.use('/api', adminRoutes);
app.use('/api', generalRoutes);

// Uncomment and configure Redis client if needed
/*
const client: RedisClientType = createClient();

(async () => {
    try {
        await client.connect();
        console.log('Connected to the Redis server from the root file!');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
})();

client.on('connect', () => {
    console.log('Connected to the Redis server from the root file!');
});

client.on('error', (err) => {
    console.error(`Redis error: ${err}`);
});

process.on('SIGINT', () => {
    client.quit();
    console.log('Redis client quit');
});
*/

// Set the port
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`My employee app backend server is running at http://localhost:${port}`);
  console.log('Press CTRL+C to stop server');
});
