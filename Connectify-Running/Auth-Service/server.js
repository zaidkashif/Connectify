const express = require('express');
const connectDB = require('./Config/db');
const authRoutes = require('./Routes/authRoutes');

const path = require('path');

const app = express();

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Replace with frontend origin
  credentials: true
}));

const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});