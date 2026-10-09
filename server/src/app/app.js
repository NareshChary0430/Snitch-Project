import express from 'express';
import authRoutes from '../routes/auth.routes.js';
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.use("/api/auth/",authRoutes);



export default app;