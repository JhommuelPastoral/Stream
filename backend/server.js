import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import connectDb from './config/db.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
dotenv.config();
const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.listen(process.env.PORT, () => {
  console.log('Listening on port ' + process.env.PORT);
  connectDb();
});

