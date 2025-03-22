import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import connectDB from './db.js';

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

import registerRoute from './routes/register.route.js';
import authRoute from './routes/auth.route.js';
import qrRoute from './routes/qr.route.js';
import entryRoute from './routes/entry.route.js';
app.use('/api/register', registerRoute);
app.use('/api/auth', authRoute);
app.use('/api/qr', qrRoute);
app.use('/api/entries', entryRoute);