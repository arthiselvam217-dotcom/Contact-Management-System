import dns from 'dns';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';

dns.setServers(['1.1.1.1']);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/contacts', contactRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');

        app.listen(process.env.PORT || 5000, () => {
            console.log(`server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });