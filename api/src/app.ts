import express from 'express';
import cors from 'cors';
import viewRoutes from './routes/views-routes.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', viewRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API corriendo en puerto ${PORT}`);
});