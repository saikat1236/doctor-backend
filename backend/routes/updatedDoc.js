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

    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    for (let i = 0; i < Booking.length; i++) {
      const booKing = Booking[i];
      if (booKing.time === formattedDate) {
        Todaybooking.push({
          userId: booKing.userId,
          name: booKing.name,
          time: booKing.time,
        });
        Booking.splice(i, 1);
        i--;
      }
    }

    //     const TodayBooking = [];
    // const Booking = [
    //   {
    //     userId: "63e387dd698370d37ca5c63f",
    //     name: null,
    //     time: "08-02-2023"
    //   },
    //   {
    //     userId: "63e387dd698370d37ca5c63f",
    //     name: null,
    //     time: "08-02-2023"
    //   },
    //   {
    //     userId: "63e387dd698370d37ca5c63f",
    //     name: null,
    //     time: "09-02-2023"
    //   },
    //   {
    //     userId: "63e387dd698370d37ca5c63f",
    //     name: null,
    //     time: "09-02-2023"
    //   }
    // ];

    // for (let i = 0; i < Booking.length; i++) {
    //   if (Booking[i].time === "08-02-2023") {
    //     TodayBooking.push(Booking[i]);
    //     Booking.splice(i, 1);
    //     i--;
    //   }
    // }

    // console.log(TodayBooking);
    // console.log(Booking);

    //   if (Booking[i].time === formattedDate)
    console.log(Booking);
    console.log(Todaybooking);
    await doctor.save();

    res.status(200).json(Todaybooking);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All doctor Information
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let doctor;

    if (qNew) {
      doctor = await Doctor.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      doctor = await Doctor.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      doctor = await Doctor.find();
    }

    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
