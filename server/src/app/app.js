import express from 'express';
import authRoutes from '../routes/auth.routes.js';
import productRoutes from '../routes/products.routes.js';
import cartRoutes from '../routes/cart.routes.js';
import cookieParser from 'cookie-parser';
const app = express();

// express.json() is only for raw json data, if the data is sent as form-data then we need to use express.urlencoded() middleware
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.use("/api/auth/",authRoutes);
app.use("/api/products/",productRoutes);
app.use("/api/cart/",cartRoutes);



export default app;