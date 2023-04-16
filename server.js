const mongoose = require('mongoose');
require('dotenv').config();

process.on('uncaughtException', err => {
  console.log(`An error occured: ${err} `);
  console.log('Shutting Down');
  process.exit(1);
});

const app = require('./app');

let DB = process.env.DATABASE;

if (process.env.NODE_ENV === 'production')
  DB = process.env.DATABASE_PROD.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('DB Connected');
  });

//Server initiation
const port = process.env.PORT;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on ${port}`);
});

//Unhandled Promise Rejection
process.on('unhandledRejection', err => {
  console.log(`An error occured: ${err} `);
  server.close(() => {
    console.log('Shutting Down');
    process.exit(1);
  });
});

//SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
