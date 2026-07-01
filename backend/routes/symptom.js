const express = require("express")
const SymptomModel = require("../models/SymptomModel")
const router = express.Router();
const mongoose = require('mongoose');

// Symptom assessment storage schema
const SymptomCheckSchema = new mongoose.Schema({
    userEmail: { type: String, required: false },
    age: { type: String },
    gender: { type: String },
    symptoms: { type: [String], default: [] },
    otherConditions: { type: String },
    medications: { type: String },
    duration: { type: String },
    severity: { type: Number },
    temperature: { type: String },
    predictions: { type: Array, default: [] },
    recommendations: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
});

const SymptomCheckModel = mongoose.models.SymptomCheck || mongoose.model('SymptomCheck', SymptomCheckSchema);

// router.post("/postSymptom", async (req, res) => {
//     const  toPost  = req.body;
//     console.log(toPost);

//     try {
//         if (!toPost) {
//             return res.status(400).json({ statusCode: 400, message: "Missing required fields in the request body" })
//         }

//         const newSymptom = await SymptomModel.post({
//             ID: toPost.ID,
//             Name: toPost.Name
//         });

//         res.json({ statusCode: 200, data: newSymptom });
//     }
//     catch (error) {
//         console.error("Error creating symptom:", error);
//         res.status(400).json({ statusCode: 400, message: "Error creating symptom", error });
//     }
// });


router.get("/getallSymptoms", async (req, res) => {
    try {
        const allSymptoms = await SymptomModel.find();
        res.json({ statusCode: 200, data: allSymptoms });
    } catch (error) {
        console.error("Error fetching symptoms:", error);
        res.status(500).json({ statusCode: 500, message: "Error fetching symptoms", error });
    }
});


// Save an assessment (POST /symptom/assess)
router.post('/assess', async (req, res) => {
    try {
        const payload = req.body;
        if (!payload || !Array.isArray(payload.symptoms) || payload.symptoms.length === 0) {
            return res.status(400).json({ statusCode: 400, message: 'Missing symptoms in request' });
        }

        const doc = await SymptomCheckModel.create(payload);
        return res.json({ statusCode: 200, data: doc });
    } catch (error) {
        console.error('Error saving symptom assessment:', error);
        return res.status(500).json({ statusCode: 500, message: 'Error saving assessment', error: error.message });
    }
});

// Get history for a user (GET /symptom/history?userEmail=...)
router.get('/history', async (req, res) => {
    try {
        const userEmail = req.query.userEmail;
        if (!userEmail) return res.status(400).json({ statusCode: 400, message: 'Missing userEmail query param' });

        const rows = await SymptomCheckModel.find({ userEmail }).sort({ createdAt: -1 }).limit(50);
        return res.json({ statusCode: 200, data: rows });
    } catch (error) {
        console.error('Error fetching history:', error);
        return res.status(500).json({ statusCode: 500, message: 'Error fetching history', error: error.message });
    }
});


module.exports = router;