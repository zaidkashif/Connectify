const express = require('express');
const connectDB = require('./config/db');
const adminRoutes = require('./Routes/adminRoute');

const path = require('path');

const app = express();
// server.js or index.js in backend
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Replace with frontend origin
  credentials: true
}));

const PORT = process.env.PORT || 5003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Routes
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});