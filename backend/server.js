require('dotenv').config();
const dns = require('dns');
const express = require('express');
const cors = require('cors'); // Add this line
const newsRoutes = require('./routes/news');
const userRoutes = require('./routes/user');
const queryRoutes = require('./routes/query');
const nutritionRoutes = require('./routes/nutritionRoute');
const blogRoutes = require('./routes/blog');
const Appointment = require("./routes/Appointment");
const Symptom = require('./routes/symptom')
const mongoose = require('mongoose');

// Use a reliable public DNS resolver for Atlas SRV lookups if the default resolver fails.
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/nearby', queryRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/appointmentinfo', Appointment);
app.use('/symptom', Symptom)

// Connect to the database
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGOURI;

if (!mongoUri) {
    console.error('Fatal: MONGOURI is not defined in environment variables.');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => {
        // Listen for requests
        app.listen(port, () => {
            console.log(`MongoDB Connected Successfully`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
