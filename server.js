import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.get("/" ,(req , res) =>{
    res.send("Hello World !");
})
app.use('/api/auth', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', serviceRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
