const express = require("express");
const AppointmentInfo = require("../models/AppointmentModel");
const router = express.Router();
const Users = require('../models/usermodel')

router.get("/getDoctors", (req, res) => {
  const { expertise } = req.query;
  console.log("LINE", expertise);
  const query = { role: "Doctor" };

  if (expertise) {
    query.expertise = expertise;
  }

  Users.find(query)
    .then((users) => {
      console.log(users);
      return res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: err, message: "Please Retry!" });
    });
});


router.get("/getappointments", async (req, res) => {
  // console.log(req.query);
  const username = req.query.username;
  console.log(username);
  const userrole = req.query.userrole;
  console.log(userrole)

  try {
    let appointments;

    if (userrole === "Patient") {
      appointments = await AppointmentInfo.find({ PName: username });
    } else if (userrole === "Doctor") {
      appointments = await AppointmentInfo.find({ $or: [{ PName: username }, { Drname: username }] });
    } else {
      return res.status(400).json({ statusCode: 400, message: "Invalid user role" });
    }

    console.log(appointments)
    res.json({ statusCode: 200, data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ statusCode: 500, message: "Error fetching appointments", error });
  }
});
router.post("/appointmentData", async (req, res) => {
  const { Name, time, date, PName, Drname } = req.body;
  console.log(req.body)

  try {
    // Input validation
    if (!Name || !time || !date || !PName || !Drname) {
      return res.status(400).json({ statusCode: 400, message: "Missing required fields in the request body" });
    }
    
    const newAppointment = await AppointmentInfo.create({
      Name: Name,
      date: date,
      slot: time,
      PName: PName,
      Drname: Drname,
      stat: "Pending",
    });

    res.json({ statusCode: 200, data: newAppointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(400).json({ statusCode: 400, message: "Error creating appointment", error });
  }
});


router.post("/update", async (req, res) => {
  const { Name, pName, dName, stat } = req.body;
  console.log(Name)
  console.log(pName)
  console.log(dName)
  console.log(stat)

  
  if (!Name || !pName || !dName || !stat) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    
    const appointment = await AppointmentInfo.updateOne(
      { Drname:dName, PName:pName, Name:Name },
      { $set: { stat: stat } }
      // Specify the update operation, such as setting new values or updating specific fields
      // For example: { $set: { stat: 'new_status' } }
    );

    
    if (appointment.nModified === 0) {
      
      return res.status(404).json({ error: 'No matching document found for update' });
    }

    
    return res.status(200).json({ message: 'Update successful' });
  } catch (error) {
    
    console.error('Error updating document:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
