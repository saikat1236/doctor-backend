import Doctor from "../models/doctor.js";
import { verifydocToken, verifyTokenAndAuthorization } from "./verifyDoc.js";
import express from "express";
const router = express.Router();

// GET Dcotor Information

router.get("/:id", verifydocToken, async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    res.status(200).json(doctor);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

//UPDATE
router.put("/:id", verifydocToken, async (req, res) => {
  try {
    const updatedUser = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser); // Return the output
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    // await User.findByIdAndDelete(req.params.id);
    const PatientDelete = { Booking: Booking[0] };
    const result = await Doctor.deleteOne(PatientDelete);

    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Today's patient Count
router.get("/todaycount/:id", verifydocToken, async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    const Booking = doctor.Booking;
    const Todaybooking = doctor.TodayBooking;
    const today = new Date();

    const formattedDate = today
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");

    for (let i = 0; i < Booking.length; i++) {
      if (Booking[i].time === formattedDate) {
        Todaybooking.push(Booking[i]);
        Booking.splice(i, 1);
        i--;
      }
    }
    // console.log(Booking);
    console.log(Todaybooking);
    await doctor.save();
    let str = Todaybooking.length.toString();
    console.log(str);

    // res.status(200).send(str);
    res.status(200).send(str);
  } catch (error) {
    res.status(500).json(error);
  }
});
// Get next patient
// router.post("/nextpatent/:id", verifyToken, async (req, res) => {});

// Get All doctor Information
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.Specialist;
  try {
    let doctor;

    if (qNew) {
      doctor = await Doctor.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      doctor = await Doctor.find({
        Specialist: {
          $in: [qCategory],
        },
        online: true,
      });
    } else {
      doctor = await Doctor.find({ online: true });
    }

    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
