import express from 'express';
import router from './routes/index.js';

// initializing app
const app = express();
const PORT = 3003;

// routes
app.get('/', (req, res) => {
  res.send(`Server is up successfully on ${PORT}`);
});

app.use('/api', router);

export default app;
