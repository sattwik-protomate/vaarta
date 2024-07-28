import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the Vaarta API',
  });
});

export default app;
