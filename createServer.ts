import app from './app';

const port = 8000;

const server = app.listen(port, () => {
  console.log(`raffle-bot-api running on port ${port}`);
});
