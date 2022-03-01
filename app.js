import express from 'express';

// initializing app
const app = express();
const PORT = 3003;

// routes
app.get('/', (req, res) => {
  res.send(`Server is up successfully on ${PORT}`);
});

// running app
app.listen(PORT, async () => {
  console.log(`App is running on port - ${PORT}`);
});
