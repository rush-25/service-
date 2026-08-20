const app = require('./app');
const { connectDB } = require('./config/db');

// DB Connection & Server Startup
connectDB().then(() => {
  console.log('Database connected successfully');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database', err);
  process.exit(1);
});
