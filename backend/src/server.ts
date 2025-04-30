import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan'; // Import morgan
import routes from './routes'; // Import central router
import { connectDB } from './database/db'; // Import database connection function

// Load environment variables
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middlewares
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Use morgan for logging HTTP requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes - Mount the central router
app.use('/api', routes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
